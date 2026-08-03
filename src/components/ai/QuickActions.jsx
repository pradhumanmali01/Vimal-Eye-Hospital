/**
 * QUICK ACTION CARDS & CHIPS
 */
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChatContext } from '../../contexts/ChatContext';
import { QUICK_ACTIONS_CONFIG } from '../../utils/ai/constants';

export default function QuickActions() {
  const { lang, texts } = useLanguage();
  const { sendMessage, startAppointmentFlow, startEnquiryFlow } = useChatContext();

  const handleAction = (item) => {
    if (item.actionType === 'APPOINTMENT_FLOW') {
      startAppointmentFlow();
      return;
    }
    if (item.actionType === 'ENQUIRY_FLOW') {
      startEnquiryFlow();
      return;
    }
    if (item.query) {
      sendMessage(item.query);
    }
  };

  return (
    <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        {texts.quickActionTitle}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
        {QUICK_ACTIONS_CONFIG.map(item => (
          <button
            key={item.id}
            onClick={() => handleAction(item)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 113, 227, 0.18)',
              background: '#FFFFFF',
              color: 'var(--apple-blue)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--apple-blue)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = 'var(--apple-blue)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label[lang] || item.label.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
