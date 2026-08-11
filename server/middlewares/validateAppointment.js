import { validateAppointmentData } from '../utils/validation.js';
import { createBookingSession, verifyAndConsumeBookingSession } from '../utils/bookingSession.js';

export function validateAppointmentMiddleware(req, res, next) {
  const body = req.body || {};
  const result = validateAppointmentData(body);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: result.errors,
    });
  }

  const isPrepare = req.query.action === 'prepare' || body.action === 'prepare';
  if (isPrepare) {
    const sessionResult = createBookingSession(result.sanitized);
    return res.status(200).json({
      success: true,
      message: 'Booking authorization created.',
      bookingAuthToken: sessionResult.bookingAuthToken,
      expiresAt: sessionResult.expiresAt,
    });
  }

  const token = body.bookingAuthToken || body.bookingToken;
  const authResult = verifyAndConsumeBookingSession(result.sanitized, token);

  if (!authResult.valid) {
    const statusCode = authResult.isReplay ? 409 : 403;
    return res.status(statusCode).json({
      success: false,
      message: authResult.error,
    });
  }

  req.sanitizedAppointment = result.sanitized;
  next();
}
