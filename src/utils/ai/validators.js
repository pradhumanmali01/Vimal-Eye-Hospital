/**
 * LIVE INPUT VALIDATION UTILITIES FOR AI ASSISTANT
 */

export function validateName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { valid: false, error: "Name cannot be empty." };
  if (trimmed.length < 2) return { valid: false, error: "Name must be at least 2 characters." };
  if (/\d/.test(trimmed)) return { valid: false, error: "Name must contain alphabets only (no numbers)." };
  if (/[^A-Za-z\s'\-]/.test(trimmed)) return { valid: false, error: "Name contains invalid special characters." };
  return { valid: true, sanitized: trimmed };
}

export function validatePhone(phone) {
  let clean = (phone || '').trim().replace(/[\s\-\(\)\+]/g, '');
  if (clean.startsWith('91') && clean.length === 12) clean = clean.slice(2);
  else if (clean.startsWith('0') && clean.length === 11) clean = clean.slice(1);

  if (!clean) return { valid: false, error: "Phone number is required." };
  if (/[^0-9]/.test(clean)) return { valid: false, error: "Phone number must contain numbers only." };
  if (clean.length !== 10) return { valid: false, error: "Phone number must be exactly 10 digits." };
  if (!/^[6-9]/.test(clean)) return { valid: false, error: "Indian mobile number must start with 6, 7, 8, or 9." };

  return { valid: true, sanitized: clean };
}

export function validateEmail(email) {
  const trimmed = (email || '').trim();
  if (!trimmed) return { valid: true, sanitized: '' }; // Optional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(trimmed)) return { valid: false, error: "Please enter a valid email address." };
  return { valid: true, sanitized: trimmed };
}

export function validateAge(age) {
  const trimmed = String(age || '').trim();
  if (!trimmed) return { valid: false, error: "Age is required." };
  const num = parseInt(trimmed, 10);
  if (isNaN(num) || num <= 0 || num > 120) return { valid: false, error: "Please enter a valid positive age." };
  return { valid: true, sanitized: num };
}

export function validateDate(dateStr) {
  const trimmed = (dateStr || '').trim();
  if (!trimmed) return { valid: false, error: "Please select a date." };
  
  const selected = new Date(trimmed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selected.getTime())) return { valid: false, error: "Invalid date format." };
  if (selected < today) return { valid: false, error: "Date cannot be in the past." };

  return { valid: true, sanitized: trimmed };
}

export function validateTime(timeStr) {
  const trimmed = (timeStr || '').trim();
  if (!trimmed) return { valid: false, error: "Please select a time slot." };
  return { valid: true, sanitized: trimmed };
}
