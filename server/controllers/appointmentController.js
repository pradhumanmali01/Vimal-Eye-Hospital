/**
 * APPOINTMENT CONTROLLER
 */
import { sendAppointmentEmails } from '../services/emailService.js';

export async function createAppointment(req, res) {
  try {
    const appointmentData = req.sanitizedAppointment || req.body;

    console.log('[AppointmentController] Processing appointment request for:', appointmentData.name);

    await sendAppointmentEmails(appointmentData);

    return res.status(200).json({
      success: true,
      message: 'Appointment request submitted successfully.',
    });
  } catch (error) {
    console.error('[AppointmentController] Error processing appointment:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send appointment request.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
