/**
 * ANIMATED THREE-DOT TYPING INDICATOR WITH TEXT
 */
import React from 'react';
import { Bot } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../data/translations';

export default function TypingIndicator() {
  const { lang } = useLanguage();
  const t = getTranslation(lang);

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', margin: '8px 0' }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--apple-blue)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,113,227,0.3)',
      }}>
        <Bot size={17} />
      </div>

      <div style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.07)',
        padding: '10px 16px',
        borderRadius: '20px 20px 20px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {t.typingText}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--apple-blue)', animation: 'aiPulse 1.2s infinite ease-in-out' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--apple-blue)', animation: 'aiPulse 1.2s infinite ease-in-out 0.2s' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--apple-blue)', animation: 'aiPulse 1.2s infinite ease-in-out 0.4s' }} />
        </div>
      </div>

      <style>{`
        @keyframes aiPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
