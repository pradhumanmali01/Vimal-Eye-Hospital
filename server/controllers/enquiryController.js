/**
 * ENQUIRY CONTROLLER
 * Handles contact/general enquiry submissions.
 * Does NOT require age or gender — those are appointment-specific.
 */
import { Resend } from 'resend';
import { generateEnquiryEmailSubject, generateEnquiryEmailHTML } from '../emails/EnquiryEmailTemplate.js';
import { sendTelegramEnquiryNotification } from '../services/telegramService.js';
import { checkAndReserveEnquiryQuota } from '../services/enquiryAbuseGuard.js';

export async function createEnquiry(req, res) {
  try {
    const enquiryData = req.sanitizedEnquiry;

    // Safety check: middleware must have run
    if (!enquiryData) {
      console.error('[EnquiryController] sanitizedEnquiry missing — middleware may not have run.');
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again or call us directly.',
      });
    }

    const { name, phone, email, subject, message } = enquiryData;
    const body = req.body || {};
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    // Persistent Abuse Protection Check & Reserve
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
      console.warn(`[EnquiryController] Blocked by EnquiryAbuseGuard (${abuseCheck.reason}) for IP ${clientIp}`);
      return res.status(abuseCheck.status || 429).json({
        success: false,
        message: abuseCheck.message || 'Too many requests. Please wait a few minutes before trying again.',
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[EnquiryController] RESEND_API_KEY is not configured.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact the hospital directly.',
      });
    }

    const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || 'pradhumanmali2@gmail.com';
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Vimal Eye Hospital <onboarding@resend.dev>';

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [HOSPITAL_EMAIL],
      subject: generateEnquiryEmailSubject({ name, subject }),
      html: generateEnquiryEmailHTML({ name, phone, email, subject, message }),
    });

    if (result.error) {
      console.error('[EnquiryController] Email failed:', result.error.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to send enquiry. Please try again or call us directly.',
      });
    }

    console.log(`[EnquiryController] Enquiry email sent. ID: ${result.data?.id}`);

    // Send Telegram notification (non-blocking)
    try {
      await sendTelegramEnquiryNotification({
        name,
        phone,
        email,
        subject,
        message,
        enquiryId: result.data?.id,
      });
    } catch (telegramError) {
      console.error('[EnquiryController] Telegram notification error:', telegramError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry submitted successfully. Our team will contact you shortly.',
    });
  } catch (error) {
    console.error('[EnquiryController] Unexpected error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to send enquiry. Please try again or call us directly.',
    });
  }
}
