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
import { checkAndReserveEnquiryQuota } from '../server/services/enquiryAbuseGuard.js';

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

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

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

    // ── 1. Validate request body ──────────────────────────────────────────────
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

    // ── 2. Persistent Abuse Protection Check & Reserve ────────────────────────
    const abuseCheck = await checkAndReserveEnquiryQuota({
      ip: clientIp,
      phone,
      email,
      subject,
      message,
      honeypot: body.website_hp,
      formRenderTime: body.form_render_time,
    });

    if (!abuseCheck.allowed) {
      console.warn(`[enquiry] Blocked by EnquiryAbuseGuard (${abuseCheck.reason}) for IP ${clientIp}`);
      return res.status(abuseCheck.status || 429).json({
        success: false,
        message: abuseCheck.message || 'Too many requests. Please wait a few minutes before trying again.',
      });
    }

    console.log(`[enquiry] Processing validated & quota-reserved enquiry from: ${name} | Subject: ${subject}`);

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
