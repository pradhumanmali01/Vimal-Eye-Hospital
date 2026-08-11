import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, ChevronRight, ChevronLeft, ShieldCheck, AlertCircle, Check, Loader2, RefreshCw } from 'lucide-react';
import { treatmentsData } from '../data/treatments';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateAge,
  validateGender,
  filterNameInput,
  filterPhoneInput,
  filterAgeInput,
  sanitizeInput,
} from '../utils/validation';

// ─── Constants ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Patient Info' },
  { id: 2, label: 'Treatment' },
  { id: 3, label: 'Select Date' },
  { id: 4, label: 'Select Time' },
  { id: 5, label: 'Confirm' },
];

const QUICK_DATES = [
  { label: 'Today', offset: 0 },
  { label: 'Tomorrow', offset: 1 },
  { label: 'In 2 Days', offset: 2 },
  { label: 'In 3 Days', offset: 3 },
];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
];

const getFormattedDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// ─── Validated Field Component ─────────────────────────────────────────────
function ValidatedField({ id, label, type = 'text', placeholder, value, touched, validResult, onChange, onBlur, autoComplete }) {
  const showError = touched && !validResult.valid;
  const showSuccess = touched && validResult.valid && String(value).trim().length > 0;
  const inputClass = `apple-text-input${showError ? ' input-error' : ''}${showSuccess ? ' input-valid' : ''}`;

  return (
    <div className="apple-input-group">
      <label className="apple-input-label" htmlFor={id}>{label}</label>
      <div className="apple-input-wrapper">
        <input
          id={id}
          className={inputClass}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={type === 'tel' || type === 'number' ? 'numeric' : undefined}
          maxLength={type === 'tel' ? 15 : type === 'number' ? 3 : 80}
          min={type === 'number' ? 1 : undefined}
          max={type === 'number' ? 120 : undefined}
        />
        {showSuccess && (
          <span className="apple-input-status-icon" style={{ color: '#10B981' }}>
            <Check size={18} strokeWidth={2.5} />
          </span>
        )}
        {showError && (
          <span className="apple-input-status-icon" style={{ color: '#EF4444' }}>
            <AlertCircle size={18} strokeWidth={2.5} />
          </span>
        )}
      </div>
      {showError && (
        <div className="apple-input-error-msg">
          <AlertCircle size={12} /> {validResult.error}
        </div>
      )}
      {showSuccess && (
        <div className="apple-input-success-msg">
          <Check size={12} /> Looks good!
        </div>
      )}
    </div>
  );
}

// ─── Optional Email Field ──────────────────────────────────────────────────
function OptionalEmailField({ id, label, value, touched, validResult, onChange, onBlur }) {
  const showError = touched && !validResult.valid && value.trim().length > 0;
  const showSuccess = touched && validResult.valid && value.trim().length > 0;
  const inputClass = `apple-text-input${showError ? ' input-error' : ''}${showSuccess ? ' input-valid' : ''}`;

  return (
    <div className="apple-input-group">
      <label className="apple-input-label" htmlFor={id}>{label}</label>
      <div className="apple-input-wrapper">
        <input
          id={id}
          className={inputClass}
          type="email"
          placeholder="rahul@example.com"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="email"
          maxLength={254}
        />
        {showSuccess && (
          <span className="apple-input-status-icon" style={{ color: '#10B981' }}>
            <Check size={18} strokeWidth={2.5} />
          </span>
        )}
        {showError && (
          <span className="apple-input-status-icon" style={{ color: '#EF4444' }}>
            <AlertCircle size={18} strokeWidth={2.5} />
          </span>
        )}
      </div>
      {showError && (
        <div className="apple-input-error-msg">
          <AlertCircle size={12} /> {validResult.error}
        </div>
      )}
    </div>
  );
}

// ─── Gender Select Field Component ──────────────────────────────────────────
function GenderSelectField({ id, label, value, touched, validResult, onChange }) {
  const showError = touched && !validResult.valid;
  const showSuccess = touched && validResult.valid;
  const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

  return (
    <div className="apple-input-group">
      <label className="apple-input-label" htmlFor={id}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 4 }}>
        {GENDER_OPTIONS.map((g) => {
          const isSelected = value === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onChange(g)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 14px',
                borderRadius: '14px',
                border: isSelected
                  ? '2px solid var(--apple-blue)'
                  : showError
                  ? '1.5px solid #EF4444'
                  : '1.5px solid rgba(0,0,0,0.12)',
                background: isSelected ? 'rgba(0, 113, 227, 0.08)' : '#FFFFFF',
                color: isSelected ? 'var(--apple-blue)' : 'var(--text-dark-primary)',
                fontWeight: isSelected ? 700 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isSelected ? 'var(--apple-blue)' : 'rgba(0,0,0,0.15)',
                flexShrink: 0
              }} />
              {g}
            </button>
          );
        })}
      </div>
      {showError && (
        <div className="apple-input-error-msg" style={{ marginTop: 6 }}>
          <AlertCircle size={12} /> {validResult.error}
        </div>
      )}
      {showSuccess && (
        <div className="apple-input-success-msg" style={{ marginTop: 6 }}>
          <Check size={12} /> Looks good!
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, initialTreatmentId }) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  // Form values
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    treatmentId: initialTreatmentId || 'cataract',
    date: getFormattedDate(0),
    time: '10:00 AM',
  });

  // Touched state
  const [touched, setTouched] = useState({ name: false, phone: false, email: false, age: false, gender: false });
  const [forceShowErrors, setForceShowErrors] = useState(false);

  // API Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  // Live validation results
  const nameResult = validateName(form.name);
  const phoneResult = validatePhone(form.phone);
  const emailResult = validateEmail(form.email);
  const ageResult = validateAge(form.age);
  const genderResult = validateGender(form.gender);
  const step1Valid = nameResult.valid && phoneResult.valid && emailResult.valid && ageResult.valid && genderResult.valid;

  const eff = {
    name: touched.name || forceShowErrors,
    phone: touched.phone || forceShowErrors,
    email: touched.email || forceShowErrors,
    age: touched.age || forceShowErrors,
    gender: touched.gender || forceShowErrors,
  };

  const handleNameChange = (e) => {
    const filtered = filterNameInput(sanitizeInput(e.target.value));
    setForm(f => ({ ...f, name: filtered }));
  };

  const handlePhoneChange = (e) => {
    const filtered = filterPhoneInput(e.target.value);
    setForm(f => ({ ...f, phone: filtered }));
  };

  const handleEmailChange = (e) => {
    setForm(f => ({ ...f, email: e.target.value }));
  };

  const handleAgeChange = (e) => {
    const filtered = filterAgeInput(e.target.value);
    setForm(f => ({ ...f, age: filtered }));
  };

  const handleGenderChange = (selectedGender) => {
    setForm(f => ({ ...f, gender: selectedGender }));
    setTouched(t => ({ ...t, gender: true }));
  };

  const selectedTreatment = treatmentsData.find(t => t.id === form.treatmentId) || treatmentsData[0];

  // Submit appointment to Resend Backend API
  const submitAppointment = async () => {
    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      age: form.age.trim(),
      gender: form.gender.trim(),
      treatment: selectedTreatment.title,
      date: form.date,
      time: form.time,
      message: 'Booking request from Vimal Eye Hospital website modal',
    };

    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitting(false);
        setSubmitted(true);
      } else {
        setIsSubmitting(false);
        setApiError(data.message || 'Unable to send email. Please try again.');
      }
    } catch (err) {
      console.error('[BookingModal] Submit error:', err);
      setIsSubmitting(false);
      setApiError('Unable to send appointment. Please check your internet connection and try again.');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!step1Valid) {
        setForceShowErrors(true);
        return;
      }
      setForceShowErrors(false);
    }

    if (step < STEPS.length) {
      setStep(s => s + 1);
    } else {
      // Step 5: Final Submission via API
      submitAppointment();
    }
  };

  const handleBack = () => {
    setApiError(null);
    if (step > 1) setStep(s => s - 1);
  };

  const handleClose = () => {
    setIsClosing(true);
    document.body.classList.remove('booking-modal-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setIsSubmitting(false);
      setApiError(null);
      setIsClosing(false);
      setTouched({ name: false, phone: false, email: false, age: false, gender: false });
      setForceShowErrors(false);
      setForm({
        name: '',
        phone: '',
        email: '',
        age: '',
        gender: '',
        treatmentId: initialTreatmentId || 'cataract',
        date: getFormattedDate(0),
        time: '10:00 AM',
      });
      onClose();
    }, 240);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;
    if (step === 1) return !step1Valid;
    if (step === 2) return !form.treatmentId;
    if (step === 3) return !form.date;
    if (step === 4) return !form.time;
    return false;
  };

  // Modal JSX
  const modalContent = (
    <div
      className={`apple-booking-overlay ${isClosing ? 'closing' : ''}`}
      onClick={e => { if (e.target === e.currentTarget && !isSubmitting) handleClose(); }}
    >
      <div className={`apple-booking-modal-card ${isClosing ? 'closing' : ''}`}>

        {/* ── Header ── */}
        <div className="apple-booking-header">
          <div>
            <div className="apple-booking-title">
              {submitted ? 'Appointment Confirmed' : 'Book Your Appointment'}
            </div>
            <div className="apple-booking-subtitle">
              {submitted
                ? 'Request transmitted to Vimal Eye Hospital, Latur.'
                : `Step ${step} of 5 — Complete your details in less than one minute.`}
            </div>
          </div>
          <button className="apple-booking-close-btn" onClick={handleClose} disabled={isSubmitting} aria-label="Close booking modal">
            <X size={18} />
          </button>
        </div>

        {/* ── Desktop Stepper ── */}
        {!submitted && (
          <div className="apple-stepper-bar">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`apple-stepper-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                  <div className="apple-stepper-num">{step > s.id ? '✓' : s.id}</div>
                  <span>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`apple-stepper-divider ${step > s.id ? 'active' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ── Mobile Compact Progress Bar ── */}
        {!submitted && (
          <div className="mobile-progress-header" style={{ display: 'none' }}>
            <span className="mobile-progress-label">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </span>
            <div className="mobile-progress-track">
              <div className="mobile-progress-fill" style={{ width: `${(step / STEPS.length) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="apple-booking-body">
          {submitted ? (
            /* ── Success Screen ── */
            <div className="apple-success-stage">
              <div className="apple-success-ring">
                <CheckCircle size={44} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark-primary)' }}>
                Appointment Request Submitted Successfully
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: 8, maxWidth: 500, lineHeight: 1.6 }}>
                Thank you, <strong>{form.name}</strong>. Our hospital team at <strong>Shivaji Chowk, Latur</strong> will contact you shortly to confirm your appointment.
              </p>
              <div style={{ background: 'rgba(0,113,227,0.06)', borderRadius: 'var(--r-xl)', padding: '20px 28px', marginTop: 24, textAlign: 'left', width: '100%', maxWidth: 480 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Treatment:</span>
                  <strong>{selectedTreatment.title}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                  <strong>{form.date} at {form.time}</strong>
                </div>
                {form.email && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Confirmation Sent To:</span>
                    <strong>{form.email}</strong>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
                <button className="btn-apple-glass apple-pill-btn" onClick={() => { setSubmitted(false); setStep(1); }}>Book Another</button>
                <button className="btn-apple-primary apple-pill-btn" onClick={handleClose}>Return to Website</button>
              </div>
            </div>
          ) : (
            <>
              {/* ── STEP 1: Patient Information ── */}
              {step === 1 && (
                <div>
                  <ValidatedField
                    id="bk-fullname"
                    label="Full Name *"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    touched={eff.name}
                    validResult={nameResult}
                    onChange={handleNameChange}
                    onBlur={() => setTouched(t => ({ ...t, name: true }))}
                    autoComplete="name"
                  />
                  <ValidatedField
                    id="bk-phone"
                    label="Phone Number *"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    touched={eff.phone}
                    validResult={phoneResult}
                    onChange={handlePhoneChange}
                    onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                    autoComplete="tel"
                  />
                  <OptionalEmailField
                    id="bk-email"
                    label="Email Address (Optional)"
                    value={form.email}
                    touched={eff.email}
                    validResult={emailResult}
                    onChange={handleEmailChange}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  />
                  <ValidatedField
                    id="bk-age"
                    label="Age *"
                    type="number"
                    placeholder="e.g. 22"
                    value={form.age}
                    touched={eff.age}
                    validResult={ageResult}
                    onChange={handleAgeChange}
                    onBlur={() => setTouched(t => ({ ...t, age: true }))}
                    autoComplete="off"
                  />
                  <GenderSelectField
                    id="bk-gender"
                    label="Gender *"
                    value={form.gender}
                    touched={eff.gender}
                    validResult={genderResult}
                    onChange={handleGenderChange}
                  />
                </div>
              )}

              {/* ── STEP 2: Treatment Selection ── */}
              {step === 2 && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Select the ophthalmic service or consultation you require:
                  </p>
                  <div className="apple-treatment-selection-grid">
                    {treatmentsData.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`apple-treatment-tile-btn ${form.treatmentId === t.id ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, treatmentId: t.id }))}
                      >
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: form.treatmentId === t.id ? 'var(--apple-blue)' : 'rgba(0,0,0,0.15)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark-primary)' }}>{t.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 3: Select Date ── */}
              {step === 3 && (
                <div>
                  <div className="apple-input-group">
                    <label className="apple-input-label" htmlFor="bk-date-picker">Choose Preferred Date *</label>
                    <input
                      id="bk-date-picker"
                      className="apple-text-input"
                      type="date"
                      min={getFormattedDate(0)}
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Quick Date Options:</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {QUICK_DATES.map(q => {
                        const targetDate = getFormattedDate(q.offset);
                        return (
                          <button
                            key={q.label}
                            type="button"
                            className={`apple-gallery-filter-pill ${form.date === targetDate ? 'active' : ''}`}
                            onClick={() => setForm(f => ({ ...f, date: targetDate }))}
                          >
                            {q.label} ({targetDate.slice(5)})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Select Time ── */}
              {step === 4 && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Select an available OPD time slot for <strong>{form.date}</strong>:
                  </p>
                  <div className="apple-timeslot-grid">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`apple-timeslot-btn ${form.time === t ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, time: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 5: Confirmation Summary ── */}
              {step === 5 && (
                <div>
                  <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '20px', border: '1.5px solid rgba(0,0,0,0.08)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { label: 'Patient Name', value: form.name },
                      { label: 'Phone Number', value: form.phone },
                      ...(form.email ? [{ label: 'Email', value: form.email }] : []),
                      { label: 'Age', value: form.age },
                      { label: 'Gender', value: form.gender },
                      { label: 'Treatment', value: selectedTreatment.title, blue: true },
                      { label: 'Date & Slot', value: `${form.date} at ${form.time}` },
                    ].map((row, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', paddingBottom: i < arr.length - 1 ? 10 : 0 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row.label}</span>
                        <strong style={{ color: row.blue ? 'var(--apple-blue)' : 'var(--text-dark-primary)', fontSize: '0.9375rem' }}>{row.value}</strong>
                      </div>
                    ))}
                  </div>

                  {apiError && (
                    <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#DC2626' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.9375rem', marginBottom: 2 }}>Unable to send appointment</strong>
                        <span style={{ fontSize: '0.875rem' }}>{apiError} Please try again.</span>
                      </div>
                      <button
                        onClick={submitAppointment}
                        disabled={isSubmitting}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: '99px', background: '#DC2626', color: '#FFF', fontWeight: 600, fontSize: '0.8125rem', border: 'none', cursor: 'pointer' }}
                      >
                        <RefreshCw size={14} className={isSubmitting ? 'spin' : ''} /> Retry
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    <ShieldCheck size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>No pre-payment required. Payment is processed upon arrival at Vimal Eye Hospital Latur.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {!submitted && (
          <div className="apple-booking-footer">
            {step > 1
              ? <button className="btn-apple-glass apple-pill-btn" onClick={handleBack} disabled={isSubmitting}><ChevronLeft size={16} /> Back</button>
              : <div />
            }
            <button
              className="btn-apple-primary apple-pill-btn"
              onClick={handleNext}
              disabled={isNextDisabled()}
              style={{ opacity: isNextDisabled() ? 0.48 : 1, cursor: isNextDisabled() ? 'not-allowed' : 'pointer' }}
              aria-disabled={isNextDisabled()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...
                </>
              ) : (
                <>
                  {step === 5 ? 'Confirm Appointment' : 'Next Step'} <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
