/**
 * CHAT MESSAGE BUBBLE
 * ChatGPT / Claude quality layout with avatars, timestamps, streaming, and interactive step controls.
 */
import React from 'react';
import { Bot, User, Calendar, CheckCircle2 } from 'lucide-react';
import StreamingMessage from './StreamingMessage';
import InteractiveControls from './InteractiveControls';
import { useChatContext } from '../../contexts/ChatContext';

export default function MessageBubble({ message, isLastMessage }) {
  const { isBot, text, timestamp, type } = {
    isBot: message.sender === 'bot',
    text: message.text,
    timestamp: message.timestamp,
    type: message.type,
  };

  const {
    startAppointmentFlow,
    currentInteractiveStep,
    sendMessage,
    handleConfirmAppointment,
    handleEditAppointment,
    patientData,
    isSubmitting,
  } = useChatContext();

  const isSuccess = type === 'SUCCESS_CONFIRMATION';

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignSelf: isBot ? 'flex-start' : 'flex-end',
        maxWidth: '88%',
        margin: '8px 0',
        flexDirection: isBot ? 'row' : 'row-reverse',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: isBot ? (isSuccess ? '#10B981' : 'var(--apple-blue)') : '#1D1D1F',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isBot ? '0 4px 12px rgba(0,113,227,0.3)' : '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {isBot ? (isSuccess ? <CheckCircle2 size={18} /> : <Bot size={18} />) : <User size={18} />}
      </div>

      {/* Bubble Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', width: '100%' }}>
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isBot ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
            fontSize: '0.875rem',
            lineHeight: 1.55,
            background: isBot
              ? (isSuccess ? 'rgba(16, 185, 129, 0.08)' : '#FFFFFF')
              : 'var(--apple-blue)',
            color: isBot ? 'var(--text-dark-primary)' : '#FFFFFF',
            border: isBot ? (isSuccess ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(0, 0, 0, 0.07)') : 'none',
            boxShadow: isBot ? '0 6px 18px rgba(0, 0, 0, 0.05)' : '0 6px 18px rgba(0, 113, 227, 0.35)',
            wordBreak: 'break-word',
          }}
        >
          {isBot ? (
            <StreamingMessage text={text} />
          ) : (
            <span>{text}</span>
          )}

          {/* Render Tappable Interactive Control Buttons if on active step */}
          {isBot && isLastMessage && currentInteractiveStep && (
            <InteractiveControls
              step={currentInteractiveStep}
              onSelect={(selectedVal) => sendMessage(selectedVal)}
              onConfirm={handleConfirmAppointment}
              onEdit={handleEditAppointment}
              patientData={patientData}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Quick inline action trigger if AI recommends booking */}
          {isBot && text.includes('Book Appointment') && !currentInteractiveStep && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => startAppointmentFlow()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: '20px',
                  background: 'var(--apple-blue)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
                }}
              >
                <Calendar size={13} /> Click to Book Appointment
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, padding: '0 4px' }}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
