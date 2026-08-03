/**
 * VIMAL EYE HOSPITAL — AI ASSISTANT ENTRY POINT
 * Modular full-stack React architecture supporting Multilingual Q&A,
 * Interactive Appointment & Enquiry flows, and Resend backend integration.
 */
import React from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ChatProvider } from '../contexts/ChatContext';
import ChatWindow from './ai/ChatWindow';

export default function AIAssistant({ onOpenBooking }) {
  return (
    <LanguageProvider>
      <ChatProvider onOpenGlobalBooking={onOpenBooking}>
        <ChatWindow />
      </ChatProvider>
    </LanguageProvider>
  );
}
