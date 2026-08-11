/**
 * VIMAL EYE HOSPITAL — ENQUIRY VALIDATION UTILITY
 * Validates contact/general enquiry fields.
 * Age and Gender are NOT required for enquiries.
 */

export function validateEnquiryData(data) {
  const errors = {};

  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim().replace(/\s+/g, '').replace(/-/g, '');
  const email = (data.email || '').trim();
  const subject = (data.subject || '').trim();
  const message = (data.message || '').trim();

  // 1. Name Validation
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2 || name.length > 80) {
    errors.name = 'Name must be between 2 and 80 characters.';
  } else if (/\d/.test(name)) {
    errors.name = 'Name cannot contain numbers.';
  } else if (/[^A-Za-z\s'\-]/.test(name)) {
    errors.name = 'Name contains invalid special characters.';
  }

  // 2. Phone Validation (10-digit Indian Mobile)
  let cleanPhone = phone;
  if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.slice(3);
  else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
  else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (/[^0-9]/.test(cleanPhone)) {
    errors.phone = 'Phone number must contain digits only.';
  } else if (cleanPhone.length !== 10) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  } else if (!/^[6-9]/.test(cleanPhone)) {
    errors.phone = 'Indian mobile number must start with 6, 7, 8, or 9.';
  }

  // 3. Email Validation (Optional)
  if (email) {
    if (email.length > 254) {
      errors.email = 'Email address is too long.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address.';
      }
    }
  }

  // 4. Subject Validation (optional — default applied if missing)
  const resolvedSubject = subject || 'General OPD Enquiry';
  if (resolvedSubject.length > 200) {
    errors.subject = 'Subject is too long (max 200 characters).';
  }

  // 5. Message Validation (optional, max 2000 chars)
  if (message.length > 2000) {
    errors.message = 'Message is too long (max 2000 characters).';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: {
      name,
      phone: cleanPhone,
      email,
      subject: resolvedSubject,
      message,
    },
  };
}
