/**
 * VIMAL EYE HOSPITAL — NVIDIA NEMOTRON AI SERVICE
 * OpenAI-Compatible SDK integration for NVIDIA Nemotron LLM.
 * Implements real streaming, reasoning content stripping, and zero-leak fallback.
 */

import OpenAI from 'openai';
import { buildSystemPrompt } from '../ai/systemPrompt.js';

function getFallbackMessage(lang = 'en') {
  if (lang === 'hi') {
    return 'क्षमा करें, मुझे अभी उत्तर देने में समस्या हो रही है। कृपया पुनः प्रयास करें या सीधे विमल आई हॉस्पिटल से संपर्क करें: +91 98765 43210';
  }
  if (lang === 'mr') {
    return 'क्षमस्व, मला आता उत्तर देण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा किंवा थेट विमल आय हॉस्पिटलशी संपर्क साधा: +91 98765 43210';
  }
  return 'Sorry, I am having trouble responding right now. Please try again or contact Vimal Eye Hospital directly at +91 98765 43210.';
}

export async function streamNVIDIACompletion({ messages = [], userQuery = '', lang = 'en', onChunk }) {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseURL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
  const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';

  // Fallback if API Key is unconfigured or default placeholder
  if (!apiKey || apiKey === 'YOUR_TEST_KEY') {
    console.warn('[NVIDIA-AI] API Key is missing or placeholder. Triggering safe fallback response.');
    onChunk(getFallbackMessage(lang));
    return;
  }

  const openai = new OpenAI({
    apiKey,
    baseURL,
  });

  // Prepare system prompt and conversation history
  const systemPrompt = buildSystemPrompt(lang);

  // Format messages array safely for OpenAI API (sanitize input & limit history length)
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
  ];

  // Truncate conversation history to last 10 turns for efficiency & safety
  const safeHistory = (Array.isArray(messages) ? messages : []).slice(-10);
  for (const msg of safeHistory) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      const cleanText = (msg.content || '').slice(0, 1000); // Limit 1000 chars per message
      if (cleanText) {
        formattedMessages.push({ role: msg.role, content: cleanText });
      }
    }
  }

  // Append current user query if provided separately
  if (userQuery && (!safeHistory.length || safeHistory[safeHistory.length - 1]?.content !== userQuery)) {
    formattedMessages.push({ role: 'user', content: userQuery.slice(0, 1000) });
  }

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 1024,
      stream: true,
    });

    let streamedAny = false;

    for await (const chunk of stream) {
      // 1. STRIP REASONING CONTENT (Do not expose internal reasoning tokens to patients)
      const reasoning = chunk.choices[0]?.delta?.reasoning_content;
      if (reasoning) {
        continue;
      }

      // 2. Extract final assistant response content
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        streamedAny = true;
        onChunk(content);
      }
    }

    if (!streamedAny) {
      onChunk(getFallbackMessage(lang));
    }
  } catch (err) {
    console.error('[NVIDIA-AI Service Error]:', err.message);
    // Never leak stack trace or API credentials to client; emit clean fallback text
    onChunk(getFallbackMessage(lang));
  }
}
