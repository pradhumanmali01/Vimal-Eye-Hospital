/**
 * VIMAL EYE HOSPITAL — INTENT CLASSIFIER & ROUTER
 * Typo-tolerant, multi-lingual (English, Hindi, Marathi, Hinglish) semantic intent router.
 * Ensures zero-failure for standard hospital patient intents.
 */

// Canonical Hospital Identity Constants
export const HOSPITAL_IDENTITY = {
  en: "Vimal Eye Hospital",
  hi: "विमल आई हॉस्पिटल",
  mr: "विमल आय हॉस्पिटल",
};

// Common Appointment / Eye Checkup Query Patterns
const APPOINTMENT_PATTERNS = [
  /appoint/i,
  /apoint/i,
  /apoit/i,
  /appoit/i,
  /apont/i,
  /book/i,
  /boking/i,
  /check.*eye/i,
  /eye.*check/i,
  /aankh.*check/i,
  /ankh.*check/i,
  /doctor.*dikh/i,
  /dikhana/i,
  /consult/i,
  /doctor.*chai/i,
  /doctor.*chahi/i,
  /visiting.*doctor/i,
  /अपॉइंटमेंट/i,
  /डॉक्टर.*चाहिए/i,
  /डॉक्टर.*दिखाना/i,
  /जांच.*करवा/i,
  /तपासाय/i,
];

// Casual / Off-Topic / Girlfriend / Personal Chatter Patterns
const OFF_TOPIC_PATTERNS = [
  /what.*doing/i,
  /did.*you.*eat/i,
  /khana.*khaya/i,
  /kya.*kar.*rahe/i,
  /my.*baby/i,
  /marry.*me/i,
  /love.*you/i,
  /are.*you.*single/i,
  /who.*won/i,
  /cricket/i,
  /python/i,
  /code/i,
  /sing.*song/i,
  /write.*script/i,
  /girlfriend/i,
  /boyfriend/i,
  /do.*you.*have.*bf/i,
];

// Greeting Patterns
const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|namaste|namaskar|good morning|good afternoon|good evening)\b/i,
  /^(नमस्ते|नमस्कार|हेलो|हाय)\b/i,
];

export function classifyIntent(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return { intent: 'UNKNOWN', confidence: 0 };

  // 1. Check Off-Topic / Casual Conversation (Must filter out casual phrases like "my baby" before medical analysis)
  // Exception: If user explicitly mentions medical child symptoms like "baby eye red" or "baby squint"
  const isMedicalChildQuery = /baby.*(eye|red|vision|squint|pain|infection|problem|drop)/i.test(q);
  if (OFF_TOPIC_PATTERNS.some(p => p.test(q)) && !isMedicalChildQuery) {
    return { intent: 'OFF_TOPIC', confidence: 0.98 };
  }

  // 2. Check Greetings
  if (GREETING_PATTERNS.some(p => p.test(q)) && q.length < 25) {
    return { intent: 'GREETING', confidence: 0.95 };
  }

  // 3. Check Appointment Intent (Typo-tolerant & multi-lingual)
  if (APPOINTMENT_PATTERNS.some(p => p.test(q))) {
    return { intent: 'START_APPOINTMENT_FLOW', confidence: 0.96 };
  }

  // 4. Specific Hospital Info Intents
  if (/opd|time|timing|tym|open|hours|kab.*khulta|baje/i.test(q)) {
    return { intent: 'OPD_TIMINGS', confidence: 0.95 };
  }

  if (/location|address|where|kaha|kha|pata|patta|map|shivaji chowk/i.test(q)) {
    return { intent: 'LOCATION', confidence: 0.95 };
  }

  if (/contact|phone|number|call|helpline|emergency|trauma|sampark/i.test(q)) {
    return { intent: 'CONTACT', confidence: 0.95 };
  }

  if (/fee|cost|price|charge|fees|kitna|paise|fees/i.test(q)) {
    return { intent: 'CONSULTATION_FEE', confidence: 0.92 };
  }

  if (/doctor|surgeon|specialist|vimal mali|ananya mali/i.test(q)) {
    return { intent: 'DOCTORS', confidence: 0.92 };
  }

  return { intent: 'GENERAL_QA', confidence: 0.5 };
}

export function getOffTopicResponse(lang = 'en') {
  if (lang === 'hi') {
    return `मैं विमल आई हॉस्पिटल का एआई रिसेप्शनिस्ट हूँ। मैं अपॉइंटमेंट बुकिंग, ओपीडी समय, उपचार और अस्पताल संबंधी जानकारी में आपकी सहायता कर सकता हूँ। मैं आपकी क्या मदद करूँ?`;
  }
  if (lang === 'mr') {
    return `मी विमल आय हॉस्पिटलचा एआय रिसेप्शनिस्ट आहे. मी अपॉइंटमेंट बुकिंग, ओपीडी वेळ, उपचार आणि रुग्णालयाच्या माहितीबाबत मदत करू शकतो. मी तुम्हाला कशी मदत करू?`;
  }
  return `I am the AI receptionist for Vimal Eye Hospital. I can assist you with eye consultation appointments, treatments, OPD timings, and hospital information. How can I help you today?`;
}

export function getGreetingResponse(lang = 'en') {
  if (lang === 'hi') {
    return `नमस्ते! 👋 मैं विमल आई असिस्टेंट हूँ। मैं आपकी विमल आई हॉस्पिटल की अपॉइंटमेंट, ओपीडी समय या उपचार संबंधी सहायता कैसे कर सकता हूँ?`;
  }
  if (lang === 'mr') {
    return `नमस्कार! 👋 मी विमल आय असिस्टंट आहे. मी तुम्हाला विमल आय हॉस्पिटलच्या अपॉइंटमेंट, ओपीडी वेळ किंवा उपचारांबद्दल कशी मदत करू शकतो?`;
  }
  return `Hello! 👋 I'm Vimal Eye Assistant. How can I assist you with appointments, treatments, or OPD timings at Vimal Eye Hospital today?`;
}
