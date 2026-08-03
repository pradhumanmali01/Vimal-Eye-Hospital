/**
 * APPOINTMENT VALIDATION MIDDLEWARE
 */
import { validateAppointmentData } from '../utils/validation.js';

export function validateAppointmentMiddleware(req, res, next) {
  const result = validateAppointmentData(req.body || {});

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: result.errors,
    });
  }

  req.sanitizedAppointment = result.sanitized;
  next();
}
