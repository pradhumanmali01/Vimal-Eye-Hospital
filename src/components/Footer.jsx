import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Calendar,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import officialLogo from '../assets/logo2.jpg';

const navLinks = [
  { label: 'Home', id: 'hero' },
  { label: 'About Hospital', id: 'about' },
  { label: 'Our Treatments', id: 'treatments' },
  { label: 'Why Choose Us', id: 'why-us' },
  { label: '360° Virtual Tour', id: 'gallery' },
  { label: 'Patient Reviews', id: 'testimonials' },
  { label: 'Location & Contact', id: 'contact' },
];

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer({ onNavigate, onOpenBooking }) {
  const [policyModal, setPolicyModal] = useState(null);

  return (
    <footer id="footer" className="apple-footer">
      {/* Ambient Radial Blue Glow */}
      <div className="apple-footer-ambient-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── 1. Top Full-Width Conversion CTA Strip ── */}
        <div className="apple-footer-cta-strip reveal-on-scroll">
          <div className="apple-footer-cta-left">
            <div className="apple-badge white" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>
              <Sparkles size={13} /> Premier Eye Care in Latur
            </div>
            <h3>Need Better Vision?</h3>
            <p>
              Experience world-class ophthalmic care with advanced micro-phaco technology, blade-free LASIK, and experienced specialists in Latur.
            </p>
          </div>
          <div className="apple-footer-cta-actions">
            <button className="btn-apple-primary apple-pill-btn" onClick={onOpenBooking}>
              <Calendar size={18} /> Book Appointment
            </button>
            <a href="tel:+919876543210" className="btn-apple-glass apple-pill-btn" style={{ color: '#FFFFFF' }}>
              <Phone size={18} /> Call Hospital
            </a>
          </div>
        </div>

        {/* ── 2. Floating Main Glass Panel ── */}
        <div className="apple-footer-panel reveal-on-scroll reveal-delay-1">
          <div className="apple-footer-v2-grid">

            {/* COLUMN 1: Identity & Glass Capsules */}
            <div>
              <div className="apple-footer-brand-logo-v2">
                <img src={officialLogo} alt="Vimal Eye Hospital Latur Logo" loading="lazy" />
                <div className="apple-footer-brand-text-v2">
                  <strong>Vimal Eye Hospital</strong>
                  <span>Superspeciality Eye Care</span>
                </div>
              </div>

              <p className="apple-footer-desc-v2">
                Sub-specialty ophthalmic center providing micro-phaco cataract surgery, 100% blade-free LASIK, vitreoretinal care, and glaucoma management in Latur, Maharashtra.
              </p>

              {/* Glass Capsule Badges */}
              <div className="apple-footer-capsule-tags">
                <div className="apple-glass-capsule rating">
                  <Star size={13} fill="#F59E0B" stroke="#F59E0B" /> ★★★★★ 5.0 Google Reviews
                </div>
                <div className="apple-glass-capsule">
                  <Award size={13} style={{ color: 'var(--apple-blue)' }} /> Micro-Phaco Specialist
                </div>
                <div className="apple-glass-capsule">
                  <ShieldCheck size={13} style={{ color: '#60D4F4' }} /> 100% Blade-Free LASIK
                </div>
                <div className="apple-glass-capsule">
                  Retina & Vitreoretinal Care
                </div>
                <div className="apple-glass-capsule">
                  Glaucoma Clinic
                </div>
              </div>

              {/* Glass Circular Social Button */}
              <div className="apple-footer-socials-v2">
                <a
                  href="https://www.instagram.com/vimaleyehospitallatur/?__pwa=1#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-social-btn-v2"
                  title="Visit our Instagram"
                  aria-label="Visit our Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>

            {/* COLUMN 2: Quick Navigation Links */}
            <div>
              <div className="apple-footer-col-title-v2">Quick Navigation</div>
              <div className="apple-footer-nav-list-v2">
                {navLinks.map(({ label, id }) => (
                  <button
                    key={id}
                    className="apple-footer-link-v2"
                    onClick={() => onNavigate(id)}
                  >
                    <ChevronRight size={14} className="link-arrow" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Individual Info Glass Cards */}
            <div>
              <div className="apple-footer-col-title-v2">Hospital Information</div>
              <div className="apple-footer-info-cards">
                {/* Address Card */}
                <div className="apple-footer-info-glass-card">
                  <div className="apple-footer-info-glass-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="apple-footer-info-glass-text">
                    <strong>Hospital Address</strong>
                    <span>Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512</span>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="apple-footer-info-glass-card">
                  <div className="apple-footer-info-glass-icon">
                    <Phone size={16} />
                  </div>
                  <div className="apple-footer-info-glass-text">
                    <strong>Helpline</strong>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>

                {/* Emergency Card */}
                <div className="apple-footer-info-glass-card">
                  <div className="apple-footer-info-glass-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                    <Phone size={16} />
                  </div>
                  <div className="apple-footer-info-glass-text">
                    <strong>24/7 Emergency</strong>
                    <a href="tel:+919876543211" style={{ color: '#EF4444', fontWeight: 700 }}>+91 98765 43211</a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="apple-footer-info-glass-card">
                  <div className="apple-footer-info-glass-icon">
                    <Mail size={16} />
                  </div>
                  <div className="apple-footer-info-glass-text">
                    <strong>Email Enquiry</strong>
                    <a href="mailto:info@vimaleyehospital.com">info@vimaleyehospital.com</a>
                  </div>
                </div>

                {/* OPD Hours Card */}
                <div className="apple-footer-info-glass-card">
                  <div className="apple-footer-info-glass-icon">
                    <Clock size={16} />
                  </div>
                  <div className="apple-footer-info-glass-text">
                    <strong>OPD Hours</strong>
                    <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 4: Apple Wallet Style Appointment Card */}
            <div>
              <div className="apple-wallet-card">
                <div className="apple-badge white" style={{ fontSize: '0.7rem', padding: '4px 10px', marginBottom: 12 }}>
                  OPD Desk
                </div>
                <h4>Need an Eye Consultation?</h4>
                <p>Schedule an OPD appointment today with senior ophthalmic surgeons in Latur.</p>

                <div className="apple-wallet-btn-pair">
                  <button
                    className="btn-apple-primary apple-pill-btn"
                    style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: '0.9rem' }}
                    onClick={onOpenBooking}
                  >
                    <Calendar size={16} /> Book Appointment
                  </button>

                  <a
                    href="tel:+919876543210"
                    className="btn-apple-glass apple-pill-btn"
                    style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: '0.85rem', color: '#FFFFFF' }}
                  >
                    <Phone size={15} /> Call Now
                  </a>
                </div>

                <div className="apple-wallet-trust-list">
                  <div className="apple-wallet-trust-item">
                    <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} /> 50,000+ Happy Patients
                  </div>
                  <div className="apple-wallet-trust-item">
                    <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} /> Advanced Micro-Phaco Tech
                  </div>
                  <div className="apple-wallet-trust-item">
                    <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} /> Experienced Specialists
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── 3. Bottom Strip Bar ── */}
          <div className="apple-footer-v2-bottom">
            <div>
              © {new Date().getFullYear()} Vimal Eye Hospital, Latur. All Rights Reserved.
            </div>

            <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
              Made with Precision for Better Vision in Latur
            </div>

            <div className="apple-footer-bottom-links-v2">
              <button onClick={() => setPolicyModal('Privacy Policy')}>Privacy Policy</button>
              <span className="dot-sep">•</span>
              <button onClick={() => setPolicyModal('Terms of Service')}>Terms of Service</button>
              <span className="dot-sep">•</span>
              <button onClick={() => setPolicyModal('Hospital Sitemap')}>Sitemap</button>
            </div>
          </div>
        </div>

      </div>

      {/* Policy & Sitemap Glass Modal */}
      {policyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 17, 0.85)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setPolicyModal(null)}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(40px)',
              borderRadius: 'var(--r-2xl)',
              padding: 36,
              maxWidth: 580,
              width: '100%',
              color: 'var(--text-dark-primary)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>{policyModal}</h3>
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setPolicyModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            {policyModal === 'Privacy Policy' && (
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Vimal Eye Hospital Latur is committed to safeguarding patient privacy. All personal health records, diagnostic evaluations, and appointment communications are treated with strict medical confidentiality under Indian Healthcare regulations.
              </p>
            )}

            {policyModal === 'Terms of Service' && (
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Clinical consultations and surgical interventions at Vimal Eye Hospital, Latur are provided by licensed ophthalmic surgeons. Online appointment requests are subject to OPD slot availability and telephone verification by our reception team.
              </p>
            )}

            {policyModal === 'Hospital Sitemap' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.9rem', color: 'var(--text-dark-secondary)' }}>
                <div>• Home — Main Hero</div>
                <div>• About Hospital</div>
                <div>• Micro-Phaco Cataract</div>
                <div>• 100% Blade-Free LASIK</div>
                <div>• Glaucoma Clinic</div>
                <div>• Pediatric Eye Care</div>
                <div>• 360° Virtual Tour</div>
                <div>• Location & Google Map</div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
