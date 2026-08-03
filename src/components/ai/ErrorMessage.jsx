/**
 * ERROR MESSAGE COMPONENT WITH RETRY & HOTLINE BUTTONS
 */
import React from 'react';
import { AlertCircle, Phone, RefreshCw } from 'lucide-react';
import { hospitalConfig } from '../../data/hospitalConfig';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      padding: '14px 16px',
      margin: '6px 0',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#EF4444', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>
        <AlertCircle size={16} /> Connection Error
      </div>
      <p style={{ fontSize: '0.82rem', color: '#333336', margin: '0 0 12px', lineHeight: 1.4 }}>
        {message || 'Unable to process request right now.'}
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '20px',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Retry
          </button>
        )}
        <a
          href={`tel:${hospitalConfig.contact.phoneRaw}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'var(--apple-blue)',
            color: '#FFFFFF',
            textDecoration: 'none',
          }}
        >
          <Phone size={13} /> Call Reception
        </a>
      </div>
    </div>
  );
}
