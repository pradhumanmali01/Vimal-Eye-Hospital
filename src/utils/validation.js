/**
 * VIMAL EYE HOSPITAL — BOOKING FORM VALIDATION
 * Production-grade, healthcare-compliant input validation.
 * Prevents XSS, rejects invalid data, and provides real-time feedback.
 */

// ─── XSS / Injection Sanitizer ────────────────────────────────────────────
export function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/javascript:/gi, '')       // Block JS URIs
    .replace(/on\w+\s*=/gi, '')         // Strip event attributes (onclick=, onerror=)
    .replace(/[&<>"'`]/g, (c) => ({    // Escape remaining HTML entities
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;', '`': '&#96;',
    }[c]));
}

// ─── Full Name Validator ───────────────────────────────────────────────────
const NAME_REGEX = /^[A-Za-z][A-Za-z\s'\-]{1,79}$/;

export function validateName(raw) {
  const value = raw.trim().replace(/\s{2,}/g, ' ');

  if (!value) {
    return { valid: false, error: 'Full name is required.' };
  }
  if (value.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  if (/\d/.test(value)) {
    return { valid: false, error: 'Please enter a valid full name. Numbers are not allowed.' };
  }
  if (/[^A-Za-z\s'\-]/.test(value)) {
    return { valid: false, error: 'Please enter a valid full name. Special characters are not allowed.' };
  }
  if (value.length > 80) {
    return { valid: false, error: 'Name must be 80 characters or fewer.' };
  }
  if (!/[A-Za-z]{2}/.test(value)) {
    return { valid: false, error: 'Please enter a valid full name (letters only).' };
  }
  return { valid: true, error: null, cleaned: value };
}

// ─── Phone Number Validator ────────────────────────────────────────────────
export function validatePhone(raw) {
  // Strip leading +91 or 0 prefix and all spaces/dashes for validation
  let value = raw.trim().replace(/\s+/g, '').replace(/-/g, '');

  // Allow +91 prefix
  if (value.startsWith('+91')) value = value.slice(3);
  else if (value.startsWith('91') && value.length === 12) value = value.slice(2);
  else if (value.startsWith('0') && value.length === 11) value = value.slice(1);

  if (!value) {
    return { valid: false, error: 'Phone number is required.' };
  }
  if (/[^0-9]/.test(value)) {
    return { valid: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (value.length !== 10) {
    return { valid: false, error: `Please enter a valid 10-digit Indian mobile number. (${value.length}/10 digits)` };
  }
  if (!/^[6-9]/.test(value)) {
    return { valid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
  }
  return { valid: true, error: null, cleaned: value };
}

// ─── Email Validator (optional field) ─────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(raw) {
  const value = raw.trim();

  // Optional: if empty, it's always valid
  if (!value) return { valid: true, error: null, cleaned: '' };

  if (value.length > 254) {
    return { valid: false, error: 'Email address is too long.' };
  }
  if (!EMAIL_REGEX.test(value)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. rahul@example.com).' };
  }
  return { valid: true, error: null, cleaned: value };
}

// ─── Age Validator ────────────────────────────────────────────────────────
export function validateAge(raw) {
  const value = String(raw || '').trim();

  if (!value) {
    return { valid: false, error: 'Please enter your age.' };
  }
  if (!/^\d+$/.test(value)) {
    return { valid: false, error: 'Please enter a valid age between 1 and 120.' };
  }
  const ageNum = Number(value);
  if (ageNum < 1 || ageNum > 120) {
    return { valid: false, error: 'Please enter a valid age between 1 and 120.' };
  }
  return { valid: true, error: null, cleaned: String(ageNum) };
}

// ─── Gender Validator ──────────────────────────────────────────────────────
export const ALLOWED_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export function validateGender(raw) {
  const value = String(raw || '').trim();

  if (!value) {
    return { valid: false, error: 'Please select your gender.' };
  }
  if (!ALLOWED_GENDERS.includes(value)) {
    return { valid: false, error: 'Please select a valid gender option.' };
  }
  return { valid: true, error: null, cleaned: value };
}

// ─── Phone Input Filter — prevents non-digit characters from being typed ──
export function filterPhoneInput(value) {
  // Allow digits, +, and spaces only while user is typing
  return value.replace(/[^\d+\s]/g, '');
}

// ─── Age Input Filter — prevents non-digit characters and limits length ────
export function filterAgeInput(value) {
  return value.replace(/[^\d]/g, '').slice(0, 3);
}

// ─── Name Input Filter — prevents digits and special chars while typing ────
export function filterNameInput(value) {
  // Allow letters, spaces, hyphens, apostrophes only
  return value.replace(/[^A-Za-z\s'\-]/g, '');
}

// ─── Validate Full Step 1 ─────────────────────────────────────────────────
export function validateStep1({ name, phone, email, age, gender }) {
  const nameResult = validateName(name || '');
  const phoneResult = validatePhone(phone || '');
  const emailResult = validateEmail(email || '');
  const ageResult = validateAge(age || '');
  const genderResult = validateGender(gender || '');
  return {
    name: nameResult,
    phone: phoneResult,
    email: emailResult,
    age: ageResult,
    gender: genderResult,
    allValid: nameResult.valid && phoneResult.valid && emailResult.valid && ageResult.valid && genderResult.valid,
  };
}

