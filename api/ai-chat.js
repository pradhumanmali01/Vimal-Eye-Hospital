/**
 * VIMAL EYE HOSPITAL — VERCEL SERVERLESS FUNCTION: /api/ai-chat
 * Handles real-time streaming NVIDIA Nemotron AI completions.
 */

import { streamNVIDIACompletion } from '../server/services/nvidiaAIService.js';
import { checkAIRateLimit } from '../server/middlewares/aiRateLimiter.js';

export default async function handler(req, res) {
  // 1. Method restriction
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 2. Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rateCheck = checkAIRateLimit(clientIp);

  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute before asking another question.',
    });
  }

  // 3. Request Body Validation
  const body = req.body || {};
  const { messages = [], userQuery = '', lang = 'en' } = body;

  if (typeof userQuery !== 'string' && !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload format.',
    });
  }

  // 4. Set Server-Sent Events (SSE) Streaming Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    await streamNVIDIACompletion({
      messages,
      userQuery,
      lang,
      onChunk: (textChunk) => {
        res.write(`data: ${JSON.stringify({ content: textChunk })}\n\n`);
      },
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[api/ai-chat] Stream handler error:', err.message);
    res.write(`data: ${JSON.stringify({ content: 'Sorry, I am having trouble responding right now. Please try again or call the hospital directly.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
