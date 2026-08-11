/**
 * ENQUIRY VALIDATION MIDDLEWARE
 */
import { validateEnquiryData } from '../utils/enquiryValidation.js';

export function validateEnquiryMiddleware(req, res, next) {
  const result = validateEnquiryData(req.body || {});

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: result.errors,
    });
  }

  req.sanitizedEnquiry = result.sanitized;
  next();
}
