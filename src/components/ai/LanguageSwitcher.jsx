/**
 * LANGUAGE SWITCHER PILL BUTTONS
 */
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, switchLanguage, languages } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => switchLanguage(l.code)}
          aria-label={`Switch language to ${l.label}`}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: lang === l.code ? 'var(--apple-blue)' : 'rgba(255, 255, 255, 0.15)',
            color: lang === l.code ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: lang === l.code ? '0 2px 8px rgba(0, 113, 227, 0.4)' : 'none',
          }}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
