import React from 'react';
import { Calendar, Phone, ShieldCheck, Star, Award, ChevronRight } from 'lucide-react';
import heroImg from '../assets/gallery/main Street View 360.jpg';
import Hero360Viewer from './Hero360Viewer';

export default function Hero({ onOpenBooking, onNavigate }) {
  return (
    <section id="hero" className="apple-hero">
      {/* Ambient Mesh Glow */}
      <div className="apple-hero-ambient-glow" />

      <div className="container apple-hero-container">
        {/* Location Badge */}
        <div className="apple-badge reveal-on-scroll" style={{ marginBottom: 24 }}>
          <ShieldCheck size={14} /> Sub-Specialty Eye Center &nbsp;·&nbsp; Latur, Maharashtra
        </div>

        {/* Hospital Branding Headline */}
        <h1 className="apple-hero-title reveal-on-scroll reveal-delay-1">
          <span style={{ color: 'var(--apple-blue)', WebkitTextFillColor: 'var(--apple-blue)' }}>Vimal Eye</span>{' '}
          <span style={{ color: 'var(--text-dark-primary)', WebkitTextFillColor: 'var(--text-dark-primary)' }}>Hospital</span>
          <br />
          <span style={{ color: 'var(--text-dark-primary)', WebkitTextFillColor: 'var(--text-dark-primary)' }}>Superspeciality</span>{' '}
          <span style={{ background: 'linear-gradient(135deg, #0071E3 0%, #0891B2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Eye Care</span>
        </h1>

        <p className="apple-hero-subtitle reveal-on-scroll reveal-delay-2">
          Experience ultra-precision ophthalmic surgery, micro-phaco cataract removal, and 100% blade-free LASIK laser at Vimal Eye Hospital, Latur.
        </p>

        {/* Double Pill CTAs */}
        <div className="apple-hero-ctas reveal-on-scroll reveal-delay-3">
          <button className="btn-apple-primary apple-pill-btn" onClick={onOpenBooking}>
            <Calendar size={18} /> Book Appointment
          </button>
          <button className="btn-apple-glass apple-pill-btn" onClick={() => onNavigate('contact')}>
            <Phone size={18} /> Contact Us <ChevronRight size={16} />
          </button>
        </div>

        {/* Layered VisionOS Visual Stage */}
        <div className="apple-hero-stage reveal-on-scroll reveal-delay-4">
          {/* Main Visual Frame */}
          <div className="apple-hero-main-card">
            <Hero360Viewer image={heroImg} />
            <div className="apple-hero-glass-overlay" />
          </div>

          {/* Floating Glass Card 1 (Left) */}
          <div className="apple-hero-float-card apple-hero-float-left">
            <div className="apple-float-icon">
              <Star size={20} />
            </div>
            <div className="apple-float-text">
              <strong>5.0 Verified Rating</strong>
              <span>Patient Reviews in Latur</span>
            </div>
          </div>

          {/* Floating Glass Card 2 (Right) */}
          <div className="apple-hero-float-card apple-hero-float-right">
            <div className="apple-float-icon">
              <Award size={20} />
            </div>
            <div className="apple-float-text">
              <strong>Advanced Laser Suites</strong>
              <span>Micro-Phaco & Vitreoretinal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
