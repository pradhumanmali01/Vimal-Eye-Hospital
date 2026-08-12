/**
 * VIMAL EYE HOSPITAL — AI CHAT RATE LIMITER
 * Protects /api/ai-chat endpoint against automated abuse & spam.
 */

const ipStore = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

export function checkAIRateLimit(clientIp) {
  const now = Date.now();
  const record = ipStore.get(clientIp);

  if (!record || now > record.resetAt) {
    ipStore.set(clientIp, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

// Cleanup stale IP entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipStore.entries()) {
    if (now > data.resetAt) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);
