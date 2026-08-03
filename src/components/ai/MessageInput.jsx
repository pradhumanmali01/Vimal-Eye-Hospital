/**
 * CHAT MESSAGE INPUT
 * Supports numeric keyboard mode on mobile for phone/age steps, placeholder translations, and locking while AI types.
 */
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../data/translations';
import { useChatContext } from '../../contexts/ChatContext';

export default function MessageInput({ onSend, isTyping, onClose }) {
  const { lang } = useLanguage();
  const t = getTranslation(lang);
  const { currentInteractiveStep } = useChatContext();
  const [input, setInput] = useState('');

  // Auto detect if numeric keyboard is required on mobile devices
  const isNumericStep = currentInteractiveStep === 'phone' || currentInteractiveStep === 'age';

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  return (
    <div
      style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <input
        type="text"
        inputMode={isNumericStep ? 'numeric' : 'text'}
        placeholder={t.inputPlaceholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isTyping}
        aria-label={t.inputPlaceholder}
        style={{
          flex: 1,
          padding: '10px 16px',
          borderRadius: '24px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          outline: 'none',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-dark-primary)',
          background: isTyping ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.2s ease',
        }}
        onFocus={e => {
          if (!isTyping) {
            e.target.style.background = '#FFFFFF';
            e.target.style.borderColor = 'var(--apple-blue)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 113, 227, 0.15)';
          }
        }}
        onBlur={e => {
          e.target.style.background = 'rgba(0, 0, 0, 0.02)';
          e.target.style.borderColor = 'rgba(0, 0, 0, 0.12)';
          e.target.style.boxShadow = 'none';
        }}
      />

      <button
        onClick={handleSend}
        disabled={!input.trim() || isTyping}
        aria-label={t.send}
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: input.trim() && !isTyping ? 'var(--apple-blue)' : 'rgba(0, 0, 0, 0.15)',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          boxShadow: input.trim() && !isTyping ? '0 4px 14px rgba(0, 113, 227, 0.35)' : 'none',
        }}
      >
        <Send size={17} />
      </button>
    </div>
  );
}
