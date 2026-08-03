import React from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';

export default function TreatmentModal({ treatment, onClose, onBook }) {
  if (!treatment) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 17, 0.75)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: 'var(--r-2xl)',
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px 36px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {treatment.category}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark-primary)', marginTop: 4 }}>
              {treatment.title}
            </h2>
          </div>
          <button
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark-primary)' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {treatment.overview && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                Overview
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-dark-secondary)', lineHeight: 1.7 }}>
                {treatment.overview}
              </p>
            </div>
          )}

          {treatment.process?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>
                Clinical Process
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {treatment.process.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, background: 'rgba(0, 0, 0, 0.03)', padding: '14px 18px', borderRadius: 'var(--r-xl)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--apple-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-dark-primary)' }}>{p.step}</strong>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{p.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 36px 32px',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn-apple-glass apple-pill-btn" onClick={onClose}>
            Close
          </button>
          <button className="btn-apple-primary apple-pill-btn" onClick={onBook}>
            <Sparkles size={16} /> Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
