/**
 * VIMAL EYE HOSPITAL — SERVER-SIDE BOOKING SESSION & AUTHORIZATION MANAGER
 * Enforces server-issued, single-use, parameter-bound appointment authorization tokens.
 * Zero secret exposure to client browser.
 */
import crypto from 'crypto';

// Server-only secret salt for payload binding hash
const SERVER_SECRET = process.env.BOOKING_AUTH_SECRET || 'VEH_INTERNAL_SERVER_AUTHORIZATION_SECRET_2026_PROD';

// In-memory server session store
const bookingSessions = new Map();
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

/**
 * Computes a SHA-256 hash of normalized appointment fields.
 */
export function computePayloadHash(data) {
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim().replace(/\s+/g, '').replace(/-/g, '');
  const age = (data.age || '').toString().trim();
  const gender = (data.gender || '').toString().trim();
  const treatment = (data.treatment || '').trim();
  const date = (data.date || '').trim();
  const time = (data.time || '').trim();

  const rawString = `${name}|${phone}|${age}|${gender}|${treatment}|${date}|${time}|${SERVER_SECRET}`;
  return crypto.createHash('sha256').update(rawString).digest('hex');
}

/**
 * Creates a server-issued single-use authorization token for a validated payload.
 */
export function createBookingSession(data) {
  cleanExpiredSessions();

  const payloadHash = computePayloadHash(data);
  const token = `veh_srv_${crypto.randomBytes(24).toString('hex')}`;
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  const sessionRecord = {
    token,
    payloadHash,
    createdAt: now,
    expiresAt,
    status: 'UNUSED', // 'UNUSED' | 'CONSUMED'
  };

  bookingSessions.set(token, sessionRecord);

  return {
    success: true,
    bookingAuthToken: token,
    expiresAt,
  };
}

/**
 * Verifies and atomically consumes a server-issued booking authorization token.
 * Prevents token replay, parameter tampering, and expired sessions.
 */
export function verifyAndConsumeBookingSession(data, token) {
  cleanExpiredSessions();

  if (!token || typeof token !== 'string') {
    return {
      valid: false,
      error: 'Missing or invalid booking authorization token. Appointments must be confirmed via the website button.',
    };
  }

  const sessionRecord = bookingSessions.get(token);

  if (!sessionRecord) {
    return {
      valid: false,
      error: 'Booking authorization token not found or invalid. Please review your details and confirm again.',
    };
  }

  // 1. Check TTL Expiration
  if (Date.now() > sessionRecord.expiresAt) {
    bookingSessions.delete(token);
    return {
      valid: false,
      error: 'Your booking session has expired. Please review your appointment details and confirm again.',
    };
  }

  // 2. Check Replay (Single-Use Violation)
  if (sessionRecord.status === 'CONSUMED') {
    return {
      valid: false,
      isReplay: true,
      error: 'This booking request has already been submitted and processed. Duplicate submission rejected.',
    };
  }

  // 3. Check Parameter Tampering (Payload Binding)
  const currentHash = computePayloadHash(data);
  if (currentHash !== sessionRecord.payloadHash) {
    return {
      valid: false,
      error: 'Appointment details were modified after preparation. Please re-confirm your appointment details.',
    };
  }

  // 4. Atomically Consume Token
  sessionRecord.status = 'CONSUMED';
  bookingSessions.set(token, sessionRecord);

  return {
    valid: true,
  };
}

/**
 * Cleanup helper for expired sessions.
 */
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [token, record] of bookingSessions.entries()) {
    if (now > record.expiresAt) {
      bookingSessions.delete(token);
    }
  }
}
