/**
 * VIMAL EYE HOSPITAL — RESEND EMAIL SERVICE
 */
import { Resend } from 'resend';
import { generateHospitalEmailSubject, generateHospitalEmailHTML } from '../emails/HospitalEmailTemplate.js';
import { generatePatientEmailSubject, generatePatientEmailHTML } from '../emails/PatientConfirmationTemplate.js';

// Resend API Key & Email Configuration
const HOSPITAL_EMAIL = process.env.HOSPITAL_EMAIL || 'pradhumanmali2@gmail.com';

// Standard Resend onboarding domain sender (for testing/development)
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Vimal Eye Hospital <onboarding@resend.dev>';

export async function sendAppointmentEmails(appointmentData) {
  const { name, phone, email, treatment, date, time, message } = appointmentData;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set. Please set it in .env');
  }
  const resend = new Resend(apiKey);

  // 1. Send Notification Email to Hospital
  const hospitalSubject = generateHospitalEmailSubject();
  const hospitalHtml = generateHospitalEmailHTML({ name, phone, email, treatment, date, time, message });

  console.log(`[EmailService] Sending hospital notification to ${HOSPITAL_EMAIL}...`);

  const hospitalResult = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [HOSPITAL_EMAIL],
    subject: hospitalSubject,
    html: hospitalHtml,
  });

  if (hospitalResult.error) {
    console.error('[EmailService] Hospital email failed:', hospitalResult.error);
    throw new Error(hospitalResult.error.message || 'Failed to send hospital notification email.');
  }

  console.log(`[EmailService] Hospital email sent successfully. ID: ${hospitalResult.data?.id}`);

  let patientEmailId = null;

  // 2. Send Confirmation Email to Patient (if patient provided an email)
  if (email && email.trim().length > 0) {
    try {
      const patientSubject = generatePatientEmailSubject();
      const patientHtml = generatePatientEmailHTML({ name, treatment, date, time });

      console.log(`[EmailService] Sending patient confirmation to ${email}...`);

      const patientResult = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: patientSubject,
        html: patientHtml,
      });

      if (patientResult.error) {
        console.warn('[EmailService] Patient confirmation email warning:', patientResult.error);
      } else {
        patientEmailId = patientResult.data?.id;
        console.log(`[EmailService] Patient email sent successfully. ID: ${patientEmailId}`);
      }
    } catch (patientErr) {
      // Log patient email error but do not fail the overall process if hospital received notification
      console.warn('[EmailService] Patient email warning:', patientErr.message);
    }
  }

  return {
    success: true,
    hospitalEmailId: hospitalResult.data?.id,
    patientEmailId,
  };
}
