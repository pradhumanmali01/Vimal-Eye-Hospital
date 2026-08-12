import { classifyIntent } from './intentClassifier.js';

export function validateName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { valid: false, error: "Name cannot be empty." };
  if (trimmed.length < 2) return { valid: false, error: "Name must be at least 2 characters." };
  if (/\d/.test(trimmed)) return { valid: false, error: "Name must contain alphabets only (no numbers)." };
  if (/[^A-Za-z\s'\-]/.test(trimmed)) return { valid: false, error: "Name contains invalid special characters." };

  const lower = trimmed.toLowerCase();

  // Single-word social tokens, greetings, and conversational fillers
  const SOCIAL_TOKENS = [
    'hi', 'hey', 'hello', 'ok', 'okay', 'yes', 'no', 'thanks', 'thank', 'thankyou',
    'namaste', 'namaskar', 'pls', 'please', 'test', 'testing', 'good', 'bye', 'goodbye',
    'sir', 'maam', 'madam', 'bro', 'buddy', 'boss', 'kya', 'kaha', 'kab', 'kaise',
    'kon', 'karo', 'krdo', 'ha', 'haa', 'nahi', 'nahin', 'na', 'info', 'help',
    'hi there', 'hello there', 'hey there'
  ];
  if (SOCIAL_TOKENS.includes(lower)) {
    return { valid: false, error: "Please enter the patient's full name (e.g. Rahul Sharma)." };
  }

  // Disambiguate hospital intent phrases/words from actual patient names
  const INVALID_NAME_WORDS = [
    'appointment', 'apointmnt', 'apoitment', 'appoitment', 'booking', 'book',
    'checkup', 'check', 'doctor', 'dikhana', 'chahiye', 'chaiye', 'want', 'need',
    'hospital', 'timing', 'timings', 'opd', 'treatment', 'fees', 'cost', 'price',
    'address', 'location', 'map', 'contact', 'phone', 'number', 'call', 'emergency',
    'lasik', 'cataract', 'glaucoma', 'retina', 'consultation', 'consult'
  ];
  if (INVALID_NAME_WORDS.some(w => lower.includes(w))) {
    return { valid: false, error: "Please enter a valid patient full name." };
  }

  // Semantic intent check: reject non-name intents (greetings, QA, hospital questions)
  const classification = classifyIntent(trimmed);
  const NON_NAME_INTENTS = [
    'GREETING',
    'OFF_TOPIC',
    'START_APPOINTMENT_FLOW',
    'OPD_TIMINGS',
    'LOCATION',
    'CONTACT',
    'CONSULTATION_FEE',
    'DOCTORS',
  ];
  if (NON_NAME_INTENTS.includes(classification.intent)) {
    return { valid: false, error: "Please enter the patient's full name." };
  }

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
