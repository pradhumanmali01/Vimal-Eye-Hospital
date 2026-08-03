/**
 * LIVE VALIDATION SERVICE
 */
import { validateName, validatePhone, validateEmail, validateAge, validateDate, validateTime } from '../utils/ai/validators';

export const validationService = {
  validateName,
  validatePhone,
  validateEmail,
  validateAge,
  validateDate,
  validateTime,

  validateAppointmentStep(stepKey, value) {
    switch (stepKey) {
      case 'name':
        return validateName(value);
      case 'phone':
        return validatePhone(value);
      case 'age':
        return validateAge(value);
      case 'email':
        return validateEmail(value);
      case 'date':
        return validateDate(value);
      case 'time':
        return validateTime(value);
      default:
        return { valid: true, sanitized: value };
    }
  },
};
