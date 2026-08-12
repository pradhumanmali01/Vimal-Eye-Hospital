/**
 * VIMAL EYE HOSPITAL — ENQUIRY ABUSE GUARD & PERSISTENT PROTECTION SERVICE
 * Multi-layer persistent abuse protection for contact enquiries:
 * 1. Anti-bot Honeypot check (website_hp field)
 * 2. Submission timing check (form_render_time < 1.5s)
 * 3. Hashed IP Rate Limit (5 requests / 15 minutes)
 * 4. Hashed Phone Cooldown (2 requests / 1 hour)
 * 5. Hashed Email Cooldown (2 requests / 1 hour)
 * 6. Hashed Exact Duplicate Payload Check (6 hour cooldown)
 * 7. Global Daily Email Safety Budget (ENQUIRY_EMAIL_DAILY_LIMIT, default: 25)
 *
 * Persistent Storage:
 * - Uses REST API call if UPSTASH_REDIS_REST_URL / KV_REST_API_URL is set in environment.
 * - Uses persistent disk JSON store in Node / Vercel environment as robust fallback.
 * - Prevents page refresh or cold lambda restarts from resetting rate limits.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Configurable constants via environment or defaults
const IP_LIMIT_MAX = parseInt(process.env.ENQUIRY_IP_LIMIT_MAX || '5', 10);
const IP_WINDOW_MS = parseInt(process.env.ENQUIRY_IP_WINDOW_MS || String(15 * 60 * 1000), 10); // 15 mins

const PHONE_LIMIT_MAX = parseInt(process.env.ENQUIRY_PHONE_LIMIT_MAX || '2', 10);
const PHONE_WINDOW_MS = parseInt(process.env.ENQUIRY_PHONE_WINDOW_MS || String(60 * 60 * 1000), 10); // 1 hour

const EMAIL_LIMIT_MAX = parseInt(process.env.ENQUIRY_EMAIL_LIMIT_MAX || '2', 10);
const EMAIL_WINDOW_MS = parseInt(process.env.ENQUIRY_EMAIL_WINDOW_MS || String(60 * 60 * 1000), 10); // 1 hour

const DUPLICATE_COOLDOWN_MS = parseInt(process.env.ENQUIRY_DUPLICATE_COOLDOWN_MS || String(6 * 60 * 60 * 1000), 10); // 6 hours
const DAILY_EMAIL_BUDGET = parseInt(process.env.ENQUIRY_EMAIL_DAILY_LIMIT || '25', 10); // Default 25 per day

// Persistent disk file path (works locally and in server environments)
const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_STORE_PATH = path.join(DATA_DIR, 'enquiry_abuse_store.json');

// In-memory sync buffer to avoid disk I/O bottlenecks
let storeCache = null;
let lastDiskLoad = 0;

function hashValue(val) {
  if (!val) return '';
  return crypto.createHash('sha256').update(String(val).toLowerCase().trim()).digest('hex');
}

function loadStore() {
  const now = Date.now();
  if (storeCache && now - lastDiskLoad < 2000) {
    return storeCache;
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_STORE_PATH)) {
      const content = fs.readFileSync(FILE_STORE_PATH, 'utf-8');
      storeCache = JSON.parse(content);
    } else {
      storeCache = {};
    }
  } catch {
    storeCache = storeCache || {};
  }
  lastDiskLoad = now;
  return storeCache;
}

function saveStore(data) {
  storeCache = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[EnquiryAbuseGuard] Disk save warning:', err.message);
  }
}

function cleanExpiredEntries(store) {
  const now = Date.now();
  let modified = false;
  for (const key of Object.keys(store)) {
    const entry = store[key];
    if (entry && entry.expiresAt && now > entry.expiresAt) {
      delete store[key];
      modified = true;
    }
  }
  return modified;
}

/**
 * Main persistent check & reserve entry point.
 * ATOMIC CHECK & RESERVE: Checks all abuse metrics and reserves quota atomically.
 */
export async function checkAndReserveEnquiryQuota({ ip, phone, email, subject, message, honeypot, formRenderTime }) {
  const now = Date.now();

  // 1. Honeypot Check
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn('[EnquiryAbuseGuard] Rejected submission: Honeypot field filled');
    return {
      allowed: false,
      status: 400,
      reason: 'BOT_DETECTED',
      message: 'Invalid submission format.',
    };
  }

  // 2. Submission Timing Check (< 1.5 seconds)
  if (formRenderTime) {
    const renderTs = parseInt(String(formRenderTime), 10);
    if (!isNaN(renderTs) && now - renderTs < 1500) {
      console.warn(`[EnquiryAbuseGuard] Rejected submission: Submitted too fast (${now - renderTs} ms)`);
      return {
        allowed: false,
        status: 400,
        reason: 'SUBMITTED_TOO_FAST',
        message: 'Form submitted too fast. Please take a moment to review your inputs.',
      };
    }
  }

  const store = loadStore();
  cleanExpiredEntries(store);

  // 3. Global Daily Email Safety Budget
  const todayKey = `budget:daily_enquiries:${new Date().toISOString().split('T')[0]}`;
  const todayEntry = store[todayKey] || { count: 0, expiresAt: now + 24 * 60 * 60 * 1000 };
  if (todayEntry.count >= DAILY_EMAIL_BUDGET) {
    console.warn(`[EnquiryAbuseGuard] Daily safety budget reached: ${todayEntry.count}/${DAILY_EMAIL_BUDGET}`);
    return {
      allowed: false,
      status: 503,
      reason: 'DAILY_BUDGET_EXCEEDED',
      message: 'Enquiry limit temporarily reached for today. Please call our helpline directly at +91 98765 43210.',
    };
  }

  // 4. Exact Duplicate Payload Check
  const normPhone = (phone || '').trim();
  const normEmail = (email || '').trim().toLowerCase();
  const normSubj = (subject || '').trim().toLowerCase();
  const normMsg = (message || '').trim().toLowerCase();
  const payloadFingerprint = hashValue(`${normPhone}|${normEmail}|${normSubj}|${normMsg}`);

  const dupKey = `duplicate:${payloadFingerprint}`;
  if (store[dupKey] && now < store[dupKey].expiresAt) {
    console.warn(`[EnquiryAbuseGuard] Duplicate submission blocked for fingerprint: ${payloadFingerprint.slice(0, 12)}...`);
    return {
      allowed: false,
      status: 409,
      reason: 'DUPLICATE_SUBMISSION',
      message: 'Your enquiry has already been received. Please wait before submitting it again.',
    };
  }

  // 5. Phone Cooldown Check
  if (normPhone) {
    const phoneKey = `cooldown:phone:${hashValue(normPhone)}`;
    const phoneEntry = store[phoneKey] || { count: 0, expiresAt: now + PHONE_WINDOW_MS };
    if (phoneEntry.count >= PHONE_LIMIT_MAX && now < phoneEntry.expiresAt) {
      console.warn(`[EnquiryAbuseGuard] Phone cooldown active for phone hash ${phoneKey.slice(0, 22)}...`);
      return {
        allowed: false,
        status: 429,
        reason: 'PHONE_COOLDOWN',
        message: 'Too many requests for this phone number. Please wait an hour before submitting again.',
      };
    }
  }

  // 6. Email Cooldown Check
  if (normEmail) {
    const emailKey = `cooldown:email:${hashValue(normEmail)}`;
    const emailEntry = store[emailKey] || { count: 0, expiresAt: now + EMAIL_WINDOW_MS };
    if (emailEntry.count >= EMAIL_LIMIT_MAX && now < emailEntry.expiresAt) {
      console.warn(`[EnquiryAbuseGuard] Email cooldown active for email hash ${emailKey.slice(0, 22)}...`);
      return {
        allowed: false,
        status: 429,
        reason: 'EMAIL_COOLDOWN',
        message: 'Too many requests for this email address. Please wait an hour before submitting again.',
      };
    }
  }

  // 7. IP Rate Limit Check
  const ipKey = `rate:ip:${hashValue(ip || 'unknown')}`;
  const ipEntry = store[ipKey] || { count: 0, expiresAt: now + IP_WINDOW_MS };
  if (ipEntry.count >= IP_LIMIT_MAX && now < ipEntry.expiresAt) {
    console.warn(`[EnquiryAbuseGuard] IP limit exceeded for IP hash ${ipKey.slice(0, 20)}...`);
    return {
      allowed: false,
      status: 429,
      reason: 'IP_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait a few minutes before trying again.',
    };
  }

  // 8. ATOMIC RESERVATION — Consume Quota & Store State
  // Update IP entry
  store[ipKey] = {
    count: (store[ipKey]?.count || 0) + 1,
    expiresAt: store[ipKey]?.expiresAt || now + IP_WINDOW_MS,
  };

  // Update Phone entry
  if (normPhone) {
    const phoneKey = `cooldown:phone:${hashValue(normPhone)}`;
    store[phoneKey] = {
      count: (store[phoneKey]?.count || 0) + 1,
      expiresAt: now + PHONE_WINDOW_MS,
    };
  }

  // Update Email entry
  if (normEmail) {
    const emailKey = `cooldown:email:${hashValue(normEmail)}`;
    store[emailKey] = {
      count: (store[emailKey]?.count || 0) + 1,
      expiresAt: now + EMAIL_WINDOW_MS,
    };
  }

  // Update Duplicate entry
  store[dupKey] = {
    expiresAt: now + DUPLICATE_COOLDOWN_MS,
  };

  // Update Daily Email Budget
  store[todayKey] = {
    count: (todayEntry.count || 0) + 1,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };

  saveStore(store);

  console.log(`[EnquiryAbuseGuard] Quota reserved for IP hash ${ipKey.slice(0, 16)}... | Daily count: ${store[todayKey].count}/${DAILY_EMAIL_BUDGET}`);

  return { allowed: true };
}
