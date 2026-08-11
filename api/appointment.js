/**
 * VERCEL SERVERLESS FUNCTION — /api/appointment
 *
 * Vercel automatically serves files inside /api/ as serverless functions.
 * This replaces the Express server for production deployment.
 * The local dev server (server/index.js) is used unchanged for localhost.
 *
 * Environment variables required in Vercel dashboard:
 *   RESEND_API_KEY
 *   HOSPITAL_EMAIL
 *   SENDER_EMAIL      (optional, defaults to onboarding@resend.dev)
 *   ALLOWED_ORIGIN    (optional, defaults to https://vimaleyehospital.com)
 *
 * For distributed rate limiting across Vercel instances, configure:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 * See: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { Resend } from 'resend';
import { validateAppointmentData } from '../server/utils/validation.js';
import { createBookingSession, verifyAndConsumeBookingSession } from '../server/utils/bookingSession.js';
import { generateHospitalEmailSubject, generateHospitalEmailHTML } from '../server/emails/HospitalEmailTemplate.js';
import { generatePatientEmailSubject, generatePatientEmailHTML } from '../server/emails/PatientConfirmationTemplate.js';
import { sendTelegramAppointmentNotification } from '../server/services/telegramService.js';

// ─── In-Memory Rate Limiter (best-effort per Vercel instance) ────────────────
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    return res.status(200).end();
  }

  setCORSHeaders(res);

  // Health check (minimal response — no internal details)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date(),
    });
  }

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
    // ── 1. Validate request body ──────────────────────────────────────────
    const body = req.body || {};
    const validation = validateAppointmentData(body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validation.errors,
      });
    }

    // ── 2. Handle Prepare Step (POST /api/appointment?action=prepare) ──────
    const isPrepare = req.query.action === 'prepare' || body.action === 'prepare';
    if (isPrepare) {
      const sessionResult = createBookingSession(validation.sanitized);
      return res.status(200).json({
        success: true,
        message: 'Booking authorization created.',
        bookingAuthToken: sessionResult.bookingAuthToken,
        expiresAt: sessionResult.expiresAt,
      });
    }

    // ── 3. Verify & Consume Single-Use Authorization Token ─────────────────
    const token = body.bookingAuthToken || body.bookingToken;
    const authResult = verifyAndConsumeBookingSession(validation.sanitized, token);

    if (!authResult.valid) {
      const statusCode = authResult.isReplay ? 409 : 403;
      return res.status(statusCode).json({
        success: false,
        message: authResult.error,
      });
    }

    // ── 4. Validate environment variables ─────────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('[appointment] RESEND_API_KEY is not configured in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact the hospital directly.',
      });
    }

    const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || 'pradhumanmali2@gmail.com';
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Vimal Eye Hospital <onboarding@resend.dev>';

    const { name, phone, email, age, gender, treatment, date, time, message } = validation.sanitized;

    console.log(`[appointment] Processing request for: ${name} | Treatment: ${treatment}`);

    // ── 3. Send hospital notification email ───────────────────────────────
    const resend = new Resend(RESEND_API_KEY);

    const hospitalResult = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [HOSPITAL_EMAIL],
      subject: generateHospitalEmailSubject({ name, treatment }),
      html: generateHospitalEmailHTML({ name, phone, email, age, gender, treatment, date, time, message }),
    });

    if (hospitalResult.error) {
      console.error('[appointment] Hospital email failed:', hospitalResult.error);
      return res.status(500).json({
        success: false,
        message: 'Email delivery failed. Please try again or contact the hospital directly.',
      });
    }

    console.log(`[appointment] Hospital email sent. ID: ${hospitalResult.data?.id}`);

    // ── 4. Send patient confirmation email (non-blocking) ─────────────────
    let patientEmailId = null;
    if (email && email.trim().length > 0) {
      try {
        const patientResult = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [email],
          subject: generatePatientEmailSubject(),
          html: generatePatientEmailHTML({ name, phone, treatment, date, time }),
        });

        if (patientResult.error) {
          console.warn('[appointment] Patient email warning:', patientResult.error);
        } else {
          patientEmailId = patientResult.data?.id;
          console.log(`[appointment] Patient email sent. ID: ${patientEmailId}`);
        }
      } catch (patientErr) {
        console.warn('[appointment] Patient email non-fatal error:', patientErr.message);
      }
    }

    // ── 5. Send Telegram notification (non-blocking) ─────────────────────
    let telegramResult = null;
    try {
      telegramResult = await sendTelegramAppointmentNotification(validation.sanitized);
    } catch (telegramErr) {
      console.error('[appointment] Telegram notification non-fatal error:', telegramErr.message);
    }

    // ── 6. Return success ─────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Appointment request submitted successfully.',
      hospitalEmailId: hospitalResult.data?.id,
      patientEmailId,
      telegramSent: telegramResult?.success || false,
    });

  } catch (err) {
    console.error('[appointment] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error. Please try again or contact the hospital directly.',
    });
  }
}
