/**
 * VIMAL EYE HOSPITAL — APPOINTMENT AUTHORIZATION TOKEN UTILITY
 * Enforces strict authorization boundaries for appointment creation.
 * Prevents unauthorized creation via direct API calls, prompt injections, or AI text generation.
 */

const BOOKING_AUTH_SECRET = 'VEH_APPOINTMENT_AUTH_SECRET_2026_VIMAL_EYE_HOSPITAL_STRICT_AUTH';

/**
 * Generates a deterministic booking authorization token for a validated appointment payload.
 */
export function generateBookingToken(data, timestamp) {
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  const age = (data.age || '').toString().trim();
  const gender = (data.gender || '').toString().trim();
  const treatment = (data.treatment || '').trim();
  const date = (data.date || '').trim();
  const time = (data.time || '').trim();

  const rawString = `${name}|${phone}|${age}|${gender}|${treatment}|${date}|${time}|${timestamp}|${BOOKING_AUTH_SECRET}`;

  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }

  const unsignedHash = hash >>> 0;
  return `veh_auth_${unsignedHash.toString(16)}_${timestamp}`;
}

/**
 * Verifies that a booking authorization token is valid, matches the payload, and is unexpired.
 */
export function verifyBookingToken(data, token, timestamp) {
  if (!token || !timestamp) return false;

  const tsNum = Number(timestamp);
  if (isNaN(tsNum)) return false;

  const now = Date.now();
  const maxAgeMs = 10 * 60 * 1000; // 10 minutes TTL

  // Reject expired tokens (>10 mins) or future timestamps (>1 min clock drift)
  if (now - tsNum > maxAgeMs || tsNum - now > 60000) {
    return false;
  }

  const expectedToken = generateBookingToken(data, tsNum);
  return token === expectedToken;
}
