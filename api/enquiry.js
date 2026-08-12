/**
 * VERCEL SERVERLESS FUNCTION — /api/enquiry
 *
 * Handles contact/general enquiries from:
 *   - ContactSection.jsx
 *   - AI Assistant Enquiry Flow (ChatContext.jsx)
 *
 * Age and Gender are NOT required for enquiries.
 *
 * Environment variables required in Vercel dashboard:
 *   RESEND_API_KEY
 *   HOSPITAL_EMAIL
 *   SENDER_EMAIL      (optional)
 *   ALLOWED_ORIGIN    (optional, defaults to hospital production domain)
 */

import { Resend } from 'resend';
import { validateEnquiryData } from '../server/utils/enquiryValidation.js';
import { generateEnquiryEmailSubject, generateEnquiryEmailHTML } from '../server/emails/EnquiryEmailTemplate.js';
import { sendTelegramEnquiryNotification } from '../server/services/telegramService.js';

// ─── In-Memory Rate Limiter (best-effort per Vercel instance) ────────────────
// NOTE: For true distributed rate limiting across Vercel serverless instances,
// configure Upstash Redis with UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
// See: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // max 10 requests per IP per window
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: record.windowStart + RATE_LIMIT_WINDOW_MS };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// ─── CORS Helper ─────────────────────────────────────────────────────────────
function setCORSHeaders(res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://vimaleyehospital.com';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    return res.status(200).end();
  }

  setCORSHeaders(res);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // ── Rate limiting ───────────────────────────────────────────────────────────
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rateCheck = checkRateLimit(clientIp);

  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a few minutes before trying again.',
      retryAfterSeconds: retryAfterSec,
    });
  }

  try {
    // ── Validate environment ──────────────────────────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('[enquiry] RESEND_API_KEY is not configured.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact the hospital directly.',
      });
    }

    const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || 'pradhumanmali2@gmail.com';
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Vimal Eye Hospital <onboarding@resend.dev>';

    // ── Validate request body ─────────────────────────────────────────────────
    const body = req.body || {};
    const validation = validateEnquiryData(body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validation.errors,
      });
    }

    const { name, phone, email, subject, message } = validation.sanitized;

    console.log(`[enquiry] Processing enquiry from: ${name} | Subject: ${subject}`);

    // ── Send hospital notification email ──────────────────────────────────────
    const resend = new Resend(RESEND_API_KEY);

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [HOSPITAL_EMAIL],
      subject: generateEnquiryEmailSubject({ name, subject }),
      html: generateEnquiryEmailHTML({ name, phone, email, subject, message }),
    });

    if (result.error) {
      console.error('[enquiry] Email delivery failed:', result.error.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to send enquiry. Please try again or call us directly.',
      });
    }

    console.log(`[enquiry] Enquiry email sent. ID: ${result.data?.id}`);

    // ── Send Telegram notification (non-blocking) ──────────────────────────────
    try {
      await sendTelegramEnquiryNotification({
        name,
        phone,
        email,
        subject,
        message,
        enquiryId: result.data?.id,
      });
    } catch (telegramErr) {
      console.error('[enquiry] Telegram notification non-fatal error:', telegramErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
    });

  } catch (err) {
    console.error('[enquiry] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to send enquiry. Please try again or call us directly.',
    });
  }
}
