/**
 * INTERACTIVE CONTROLS FOR CHAT
 * Tappable Treatment cards, Gender buttons, Date picker pills, Time slot buttons, and Confirmation action buttons.
 */
import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function InteractiveControls({ step, onSelect, onConfirm, onEdit, patientData, isSubmitting }) {
  const { texts } = useLanguage();

  // 1. Treatment Selector
  if (step === 'treatment') {
    const treatments = [
      { id: 'cataract', label: texts?.treatmentCat || '🔬 Micro-Phaco Cataract Surgery' },
      { id: 'lasik', label: texts?.treatmentLasik || '👁 100% Blade-Free LASIK Laser' },
      { id: 'retina', label: texts?.treatmentRetina || '👁 Vitreoretinal & Retina Care' },
      { id: 'glaucoma', label: texts?.treatmentGlaucoma || '🧿 Glaucoma Clinic & Screening' },
      { id: 'pediatric', label: texts?.treatmentPediatric || '👶 Pediatric Ophthalmology' },
      { id: 'opd', label: texts?.treatmentOpd || '🩺 General Eye OPD Checkup' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 }}>
        {treatments.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(0, 113, 227, 0.2)',
              background: '#FFFFFF',
              color: 'var(--text-dark-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0, 113, 227, 0.06)';
              e.currentTarget.style.borderColor = 'var(--apple-blue)';
              e.currentTarget.style.transform = 'translateX(3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.2)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>{t.label}</span>
            <ChevronRight size={16} style={{ color: 'var(--apple-blue)' }} />
          </button>
        ))}
      </div>
    );
  }

  // 2. Gender Selector
  if (step === 'gender') {
    const genders = [
      { id: 'male', label: texts?.genderMale || 'Male' },
      { id: 'female', label: texts?.genderFemale || 'Female' },
      { id: 'other', label: texts?.genderOther || 'Other' },
      { id: 'pnts', label: texts?.genderPreferNotToSay || 'Prefer not to say' },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, width: '100%', marginTop: 8 }}>
        {genders.map(g => (
          <button
            key={g.id}
            onClick={() => onSelect(g.label)}
            style={{
              padding: '10px 14px',
              borderRadius: '20px',
              border: '1px solid var(--apple-blue)',
              background: '#FFFFFF',
              color: 'var(--apple-blue)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--apple-blue)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = 'var(--apple-blue)';
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
    );
  }

  // 3. Date Selector (Quick Pills + HTML5 Native Date Picker)
  if (step === 'date') {
    const today = new Date();
    const formatDate = (offset) => {
      const d = new Date();
      d.setDate(today.getDate() + offset);
      return d.toISOString().split('T')[0];
    };

    const quickDates = [
      { label: 'Today', date: formatDate(0) },
      { label: 'Tomorrow', date: formatDate(1) },
      { label: 'In 2 Days', date: formatDate(2) },
      { label: 'In 3 Days', date: formatDate(3) },
    ];

    const todayStr = formatDate(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickDates.map(qd => (
            <button
              key={qd.date}
              onClick={() => onSelect(qd.date)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 12px',
                borderRadius: '18px',
                border: '1px solid var(--apple-blue)',
                background: '#FFFFFF',
                color: 'var(--apple-blue)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📅 {qd.label} ({qd.date.slice(5)})
            </button>
          ))}
        </div>

        {/* Custom Native Date Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', padding: '6px 12px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)' }}>
          <Calendar size={16} style={{ color: 'var(--apple-blue)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Or choose custom date:</span>
          <input
            type="date"
            min={todayStr}
            onChange={(e) => {
              if (e.target.value) onSelect(e.target.value);
            }}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              color: 'var(--text-dark-primary)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    );
  }

  // 4. Time Slot Selector
  if (step === 'time') {
    const slots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, width: '100%', marginTop: 8 }}>
        {slots.map(s => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '9px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 113, 227, 0.25)',
              background: '#FFFFFF',
              color: 'var(--apple-blue)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--apple-blue)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = 'var(--apple-blue)';
            }}
          >
            <Clock size={13} /> {s}
          </button>
        ))}
      </div>
    );
  }

  // 5. Confirmation Action Buttons & Structured Summary Card
  if (step === 'confirm') {
    const data = patientData || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
        {/* Structured React Summary Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.04), rgba(16, 185, 129, 0.04))',
            borderRadius: '16px',
            border: '1px solid rgba(0, 113, 227, 0.15)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-dark-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            📋 Appointment Summary
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 12px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>👤 Patient</span>
              <strong style={{ color: '#000000' }}>{data.name || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>📞 Phone</span>
              <strong style={{ color: '#000000' }}>+91 {data.phone || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>🎂 Age</span>
              <strong style={{ color: '#000000' }}>{data.age ? `${data.age} Years` : 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>🚻 Gender</span>
              <strong style={{ color: '#000000' }}>{data.gender || 'N/A'}</strong>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>👁 Treatment</span>
              <strong style={{ color: 'var(--apple-blue)' }}>{data.treatment || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>📅 Date</span>
              <strong style={{ color: '#000000' }}>{data.date || 'N/A'}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>🕐 Time</span>
              <strong style={{ color: '#000000' }}>{data.time || 'N/A'}</strong>
            </div>
          </div>
        </div>

        {/* Real Application-Controlled Confirmation Button */}
        <button
          disabled={isSubmitting}
          onClick={() => {
            if (onConfirm) onConfirm();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '12px 16px',
            borderRadius: '22px',
            border: 'none',
            background: isSubmitting ? '#9CA3AF' : '#10B981',
            color: '#FFFFFF',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          {isSubmitting ? '⏳ Submitting Appointment...' : '✓ Confirm Appointment'}
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            disabled={isSubmitting}
            onClick={() => {
              if (onEdit) onEdit();
              else if (onSelect) onSelect('EDIT');
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '9px 12px',
              borderRadius: '18px',
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#FFFFFF',
              color: 'var(--text-dark-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            ✎ Edit Details
          </button>
        </div>
      </div>
    );
  }

  return null;
}
