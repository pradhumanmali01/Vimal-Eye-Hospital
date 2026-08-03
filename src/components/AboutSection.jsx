import React from 'react';
import { HeartHandshake, Microscope, ShieldCheck, ChevronRight } from 'lucide-react';
import aboutImg from '../assets/gallery/5Street View 360.jpg';

const pillars = [
  {
    icon: <HeartHandshake size={18} />,
    title: 'Patient-Centered Excellence',
    desc: 'Empathetic clinical consultation tailored to individual visual requirements.',
  },
  {
    icon: <Microscope size={18} />,
    title: 'Advanced Surgical Suites',
    desc: 'Micro-phacoemulsification, spectral OCT, and precision laser platforms.',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Ethical Medical Practice',
    desc: 'Transparent diagnosis and evidence-based treatment protocols.',
  },
];

export default function AboutSection({ onOpenBooking }) {
  return (
    <section id="about" className="apple-about-section">
      <div className="container">
        <div className="apple-about-grid">
          {/* Left Stage */}
          <div className="apple-about-visual-stage reveal-on-scroll">
            <div className="apple-about-photo-card">
              <img src={aboutImg} alt="Vimal Eye Hospital Latur Facility" loading="lazy" decoding="async" />
            </div>

            {/* Overlapping Glass Badge */}
            <div className="apple-about-glass-badge reveal-on-scroll reveal-delay-2">
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Sub-Specialty Ocular Center
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark-primary)', marginTop: 4 }}>
                Shivaji Chowk, Latur
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Opposite Shantai Hotel, Ambejogai Road
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="apple-about-content reveal-on-scroll reveal-delay-1">
            <div className="apple-badge">About Vimal Eye Hospital</div>

            <h2 className="apple-h2" style={{ marginTop: 16 }}>
              Precision Ophthalmic Care in Latur.
            </h2>

            <p className="apple-about-desc">
              Vimal Eye Hospital is a modern sub-specialty eye hospital located at Shivaji Chowk, Ambejogai Road, Latur. We provide complete eye care solutions ranging from advanced cataract surgery and LASIK vision correction to complex retina and glaucoma care.
            </p>

            <div className="apple-about-pills">
              {pillars.map((p, i) => (
                <div key={i} className={`apple-about-pill-item reveal-on-scroll reveal-delay-${i + 1}`}>
                  <div className="apple-about-pill-icon">{p.icon}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-dark-primary)' }}>{p.title}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-apple-primary apple-pill-btn" onClick={onOpenBooking}>
              Schedule Consultation <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
