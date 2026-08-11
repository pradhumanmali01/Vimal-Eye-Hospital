/**
 * APPOINTMENT CONTROLLER
 */
import { sendAppointmentEmails } from '../services/emailService.js';
import { sendTelegramAppointmentNotification } from '../services/telegramService.js';

export async function createAppointment(req, res) {
  try {
    const appointmentData = req.sanitizedAppointment || req.body;

    console.log('[AppointmentController] Processing appointment request for:', appointmentData.name);

    await sendAppointmentEmails(appointmentData);

    // Send Telegram notification (non-blocking)
    try {
      await sendTelegramAppointmentNotification(appointmentData);
    } catch (telegramError) {
      console.error('[AppointmentController] Telegram notification error:', telegramError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment request submitted successfully.',
    });
  } catch (error) {
    console.error('[AppointmentController] Error processing appointment:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to send appointment request. Please try again or call us directly.',
    });
  }
}

