import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Navigation,
  Share2,
  Loader2,
  ChevronDown,
  Check,
} from 'lucide-react';
import officialLogo from '../assets/logo2.jpg';
import { validateName, validatePhone, filterNameInput, filterPhoneInput, sanitizeInput } from '../utils/validation';

const MAPS_LINK = "https://www.google.com/maps/place/Vimal+Eye+Hospital/@18.4017529,76.5646892,17z/data=!4m16!1m9!3m8!1s0x3bcf85802fe200ef:0xb5c36a10647049c0!2sVimal+Eye+Hospital!8m2!3d18.4017301!4d76.5647644!9m1!1b1!16s%2Fg%2F11y30cy60s!3m5!1s0x3bcf85802fe200ef:0xb5c36a10647049c0!8m2!3d18.4017301!4d76.5647644!16s%2Fg%2F11y30cy60s";

const SUBJECT_OPTIONS = [
  'General OPD Enquiry',
  'Micro-Phaco Cataract Surgery',
  '100% Blade-Free LASIK Laser',
  'Vitreoretinal & Retina Care',
  'Glaucoma Consultation',
  'Pediatric Ophthalmology',
  'Other Eye Concern',
];

// ─── Custom Apple-Inspired Glass Dropdown Component ────────────────────────
function CustomAppleDropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="apple-custom-dropdown">
      <div
        className={`apple-custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <ChevronDown size={18} className={`apple-custom-dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="apple-custom-dropdown-menu" role="listbox">
          {options.map((opt) => (
            <div
              key={opt}
              className={`apple-dropdown-item ${opt === value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
              role="option"
              aria-selected={opt === value}
            >
              <span>{opt}</span>
              {opt === value && <Check size={16} style={{ color: 'var(--apple-blue)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Contact Section ──────────────────────────────────────────────────
export default function ContactSection({ onOpenBooking }) {
  const [formRenderTime] = useState(() => Date.now());
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General OPD Enquiry',
    message: '',
    website_hp: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);

    const nameVal = validateName(form.name);
    const phoneVal = validatePhone(form.phone);

    if (!nameVal.valid) {
      setErrorMsg(nameVal.error);
      return;
    }
    if (!phoneVal.valid) {
      setErrorMsg(phoneVal.error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          subject: form.subject || 'General OPD Enquiry',
          message: form.message.trim() || 'Enquiry submitted via Contact Section',
          website_hp: form.website_hp,
          form_render_time: formRenderTime,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLoading(false);
        setSubmitted(true);
      } else {
        setLoading(false);
        setErrorMsg(data.message || 'Unable to send enquiry. Please try again.');
      }
    } catch (err) {
      console.error('[ContactSection] Submit error:', err.message);
      setLoading(false);
      setErrorMsg('Unable to send enquiry. Please check your connection and try again.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(MAPS_LINK);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <section id="contact" className="apple-contact-section">
      <div className="apple-contact-container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }} className="reveal-on-scroll">
          <div className="apple-badge">Location & Consultation</div>
          <h2 className="apple-h2" style={{ marginTop: 12 }}>
            Visit Us in Latur.
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
            Located conveniently at Shivaji Chowk, Ambejogai Road, Latur. Connect with our ophthalmic team today.
          </p>
        </div>

        {/* 40% / 60% Split Cards */}
        <div className="apple-contact-split-v2">

          {/* LEFT CARD: Hospital Info (40%) */}
          <div className="apple-contact-left-card-v2 reveal-on-scroll reveal-delay-1">
            <div>
              <div className="apple-contact-brand-header">
                <img src={officialLogo} alt="Vimal Eye Hospital Logo" loading="lazy" />
                <div>
                  <strong>Vimal Eye Hospital</strong>
                  <span>Superspeciality Eye Care</span>
                </div>
              </div>

              <div className="apple-contact-info-cards-list">
                {/* Address Mini Card */}
                <div className="apple-contact-mini-glass-card">
                  <div className="apple-contact-mini-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="apple-contact-mini-text">
                    <strong>Hospital Location</strong>
                    <span>Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512, Maharashtra</span>
                  </div>
                </div>

                {/* OPD Phone Mini Card */}
                <div className="apple-contact-mini-glass-card">
                  <div className="apple-contact-mini-icon">
                    <Phone size={16} />
                  </div>
                  <div className="apple-contact-mini-text">
                    <strong>OPD Helpline</strong>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>

                {/* Emergency Mini Card */}
                <div className="apple-contact-mini-glass-card">
                  <div className="apple-contact-mini-icon emergency">
                    <Phone size={16} />
                  </div>
                  <div className="apple-contact-mini-text">
                    <strong>24/7 Emergency Wing</strong>
                    <a href="tel:+919876543211" style={{ color: '#EF4444', fontWeight: 700 }}>+91 98765 43211</a>
                  </div>
                </div>

                {/* OPD Hours Mini Card */}
                <div className="apple-contact-mini-glass-card">
                  <div className="apple-contact-mini-icon">
                    <Clock size={16} />
                  </div>
                  <div className="apple-contact-mini-text">
                    <strong>OPD Timings</strong>
                    <span>Monday – Saturday: 9:00 AM – 8:00 PM</span>
                  </div>
                </div>

                {/* Email Mini Card */}
                <div className="apple-contact-mini-glass-card">
                  <div className="apple-contact-mini-icon">
                    <Mail size={16} />
                  </div>
                  <div className="apple-contact-mini-text">
                    <strong>Email Address</strong>
                    <a href="mailto:info@vimaleyehospital.com">info@vimaleyehospital.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="apple-contact-left-actions">
              {onOpenBooking && (
                <button className="btn-apple-primary apple-pill-btn full-btn" onClick={onOpenBooking} style={{ height: 46 }}>
                  <Calendar size={16} /> Book Appointment
                </button>
              )}
              <a href="tel:+919876543210" className="btn-apple-glass apple-pill-btn" style={{ color: '#FFF', height: 44, fontSize: '0.84rem' }}>
                <Phone size={15} /> Call Now
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="btn-apple-glass apple-pill-btn" style={{ color: '#60D4F4', height: 44, fontSize: '0.84rem' }}>
                <Navigation size={15} /> Directions
              </a>
            </div>
          </div>

          {/* RIGHT CARD: Premium Contact Form (60%) */}
          <div className="apple-contact-right-card-v2 reveal-on-scroll reveal-delay-2">
            <div className="apple-contact-form-header">
              <h3>Book an Enquiry</h3>
              <p>Fill in your details and our senior OPD desk in Latur will reach out to you promptly.</p>
            </div>

            {submitted ? (
              <div style={{ padding: 28, borderRadius: 20, background: '#ECFDF5', border: '1.5px solid #A7F3D0', color: '#065F46', textAlignment: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <CheckCircle2 size={42} style={{ color: '#10B981' }} />
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065F46' }}>Enquiry Submitted Successfully</h4>
                <p style={{ fontSize: '0.9rem', color: '#047857', maxWidth: 400, lineHeight: 1.5, textAlign: 'center' }}>
                  Thank you, <strong>{form.name}</strong>. Our hospital reception team at Shivaji Chowk, Latur will call you at <strong>{form.phone}</strong> shortly.
                </p>
                <button className="btn-apple-primary apple-pill-btn" style={{ marginTop: 6 }} onClick={() => setSubmitted(false)}>
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form className="apple-contact-form-grid" onSubmit={handleSubmit}>

                {/* Honeypot field (hidden from real users, tricks automated spam bots) */}
                <input
                  type="text"
                  name="website_hp"
                  value={form.website_hp || ''}
                  onChange={e => setForm({ ...form, website_hp: e.target.value })}
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name & Phone Row */}
                <div className="apple-contact-input-row">
                  <div className="apple-contact-field-group">
                    <label className="apple-contact-field-label" htmlFor="ct-name">Full Name *</label>
                    <input
                      id="ct-name"
                      className="apple-contact-input"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: filterNameInput(sanitizeInput(e.target.value)) })}
                    />
                  </div>

                  <div className="apple-contact-field-group">
                    <label className="apple-contact-field-label" htmlFor="ct-phone">Phone Number *</label>
                    <input
                      id="ct-phone"
                      className="apple-contact-input"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: filterPhoneInput(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Email & Custom Dropdown Row */}
                <div className="apple-contact-input-row">
                  <div className="apple-contact-field-group">
                    <label className="apple-contact-field-label" htmlFor="ct-email">Email Address (Optional)</label>
                    <input
                      id="ct-email"
                      className="apple-contact-input"
                      type="email"
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="apple-contact-field-group">
                    <label className="apple-contact-field-label">Subject / Concern *</label>
                    <CustomAppleDropdown
                      value={form.subject}
                      options={SUBJECT_OPTIONS}
                      onChange={(opt) => setForm({ ...form, subject: opt })}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="apple-contact-field-group">
                  <label className="apple-contact-field-label" htmlFor="ct-msg">Describe Your Query / Concern</label>
                  <textarea
                    id="ct-msg"
                    className="apple-contact-textarea"
                    placeholder="Tell us about your eye symptoms, preferred doctor, or query..."
                    rows={3}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0 }} /> {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-apple-primary apple-pill-btn"
                  disabled={loading}
                  style={{ height: 50, fontSize: '0.95rem', marginTop: 4 }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spin" /> Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      Submit Enquiry <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* COMPACT INTERACTIVE MAP SECTION (460px Height) */}
        <div className="apple-contact-map-section-v2 reveal-on-scroll reveal-delay-3">
          <iframe
            title="Vimal Eye Hospital Latur Interactive Map"
            src="https://maps.google.com/maps?q=18.4017301,76.5647644&t=&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />

          {/* Floating Glass Card Overlay on Map */}
          <div className="apple-contact-map-overlay-card">
            <div className="apple-badge white" style={{ fontSize: '0.68rem', padding: '3px 8px', marginBottom: 6 }}>
              📍 Shivaji Chowk, Latur
            </div>
            <h4>Vimal Eye Hospital</h4>
            <p>Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512, Maharashtra</p>

            <div className="apple-contact-map-overlay-actions">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-apple-primary apple-pill-btn"
                style={{ height: 38, padding: '0 14px', fontSize: '0.8rem' }}
              >
                <Navigation size={13} /> Directions
              </a>

              <a
                href="tel:+919876543210"
                className="btn-apple-glass apple-pill-btn"
                style={{ height: 38, padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-dark-primary)' }}
              >
                <Phone size={13} /> Call
              </a>

              <button
                type="button"
                className="btn-apple-glass apple-pill-btn"
                style={{ height: 38, padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-dark-primary)' }}
                onClick={handleShare}
                title="Share Location Link"
              >
                <Share2 size={13} /> {copiedShare ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
