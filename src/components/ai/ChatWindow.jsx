/**
 * MAIN AI CHAT WINDOW & FLOATING CONTAINER
 * Glassmorphic panel, header, language toggle, chat body, mobile & desktop optimized
 */
import React, { useEffect, useRef } from 'react';
import { Bot, X, MessageCircle } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import QuickActions from './QuickActions';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { useChatContext } from '../../contexts/ChatContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../data/translations';

export default function ChatWindow() {
  const {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    chatBodyRef,
  } = useChatContext();

  const { lang } = useLanguage();
  const t = getTranslation(lang);
  const windowRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        className="ai-launcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t.btnClose : "Open AI Assistant"}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 2500,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--apple-blue)',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(0, 113, 227, 0.45)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          ref={windowRef}
          role="dialog"
          aria-label="Vimal Eye Hospital AI Assistant"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: 96,
            right: 28,
            zIndex: 2500,
            width: 390,
            maxWidth: 'calc(100vw - 32px)',
            height: 600,
            maxHeight: 'calc(100vh - 120px)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '26px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatWindowPop 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: '#050811',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'var(--apple-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 10px rgba(0, 113, 227, 0.4)',
                }}
              >
                <Bot size={19} />
              </div>
              <div>
                <strong style={{ fontSize: '0.94rem', display: 'block', lineHeight: 1.2 }}>{t.botName}</strong>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  {t.onlineStatus}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LanguageSwitcher />
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t.btnClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <QuickActions />

          {/* Chat Messages Body */}
          <div
            ref={chatBodyRef}
            style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(245,245,247,0.6) 100%)',
            }}
          >
            {messages.map((m, index) => (
              <MessageBubble
                key={m.id}
                message={m}
                isLastMessage={index === messages.length - 1}
              />
            ))}

            {isTyping && <TypingIndicator />}
          </div>

          {/* Input Bar */}
          <MessageInput
            onSend={sendMessage}
            isTyping={isTyping}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      <style>{`
        @keyframes chatWindowPop {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
