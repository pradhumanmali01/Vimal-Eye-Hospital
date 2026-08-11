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
 *   SENDER_EMAIL  (optional, defaults to onboarding@resend.dev)
 */

import { Resend } from 'resend';
import { validateAppointmentData } from '../server/utils/validation.js';
import { generateHospitalEmailSubject, generateHospitalEmailHTML } from '../server/emails/HospitalEmailTemplate.js';
import { generatePatientEmailSubject, generatePatientEmailHTML } from '../server/emails/PatientConfirmationTemplate.js';
import { sendTelegramAppointmentNotification } from '../server/services/telegramService.js';

// ─── CORS helper ────────────────────────────────────────────────────────────
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── Main Handler ────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    return res.status(200).end();
  }

  setCORSHeaders(res);

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Vimal Eye Hospital API (Vercel)',
      timestamp: new Date(),
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // ── 1. Validate environment variables ─────────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('[appointment] RESEND_API_KEY is missing from environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: email service not configured. Please contact the hospital directly.',
        debug: 'RESEND_API_KEY not set in Vercel environment variables.',
      });
    }

    const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || 'pradhumanmali2@gmail.com';
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Vimal Eye Hospital <onboarding@resend.dev>';

    // ── 2. Validate request body ──────────────────────────────────────────
    const body = req.body || {};
    const validation = validateAppointmentData(body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validation.errors,
      });
    }

    const { name, phone, email, age, gender, treatment, date, time, message } = validation.sanitized;

    console.log(`[appointment] Processing request for: ${name} | Treatment: ${treatment}`);

    // ── 3. Send hospital notification email ───────────────────────────────
    const resend = new Resend(RESEND_API_KEY);

    const hospitalResult = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [HOSPITAL_EMAIL],
      subject: generateHospitalEmailSubject(),
      html: generateHospitalEmailHTML({ name, phone, email, age, gender, treatment, date, time, message }),
    });

    if (hospitalResult.error) {
      console.error('[appointment] Hospital email failed:', hospitalResult.error);
      return res.status(500).json({
        success: false,
        message: `Email delivery failed: ${hospitalResult.error.message || 'Unknown Resend error'}`,
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
          html: generatePatientEmailHTML({ name, treatment, date, time }),
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

    // ── 5. Send Telegram notification (non-blocking) ────────────────────
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
    console.error('[appointment] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Unexpected server error. Please try again or contact the hospital directly.',
    });
  }
}
