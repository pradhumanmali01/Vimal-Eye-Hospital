/**
 * VIMAL EYE HOSPITAL — EXPRESS CONTROLLER: /api/ai-chat
 * Serves Express dev server endpoint for NVIDIA Nemotron AI.
 */

import { streamNVIDIACompletion } from '../services/nvidiaAIService.js';
import { checkAIRateLimit } from '../middlewares/aiRateLimiter.js';

export async function handleAIChatStream(req, res) {
  // 1. Rate limiting
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

  // 2. Body validation
  const body = req.body || {};
  const { messages = [], userQuery = '', lang = 'en' } = body;

  if (typeof userQuery !== 'string' && !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload format.',
    });
  }

  // 3. Set SSE Streaming Headers
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
    console.error('[aiChatController] Stream error:', err.message);
    res.write(`data: ${JSON.stringify({ content: 'Sorry, I am having trouble responding right now. Please try again or call the hospital directly.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
