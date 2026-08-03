import React from 'react';
import { Sparkles } from 'lucide-react';

const features = [
  {
    num: '01',
    title: 'Specialist Ophthalmologists',
    desc: 'Every diagnostic & surgical intervention is led by experienced ophthalmic specialists.',
  },
  {
    num: '02',
    title: 'Advanced Diagnostic Suite',
    desc: 'OCT retinal imaging, optical biometry, corneal topography, and automated perimetry.',
  },
  {
    num: '03',
    title: 'Precision Micro-Surgery',
    desc: 'Micro-phacoemulsification for cataract removal and blade-free laser platforms.',
  },
  {
    num: '04',
    title: 'Sterile Operating Environment',
    desc: 'Pharmaceutical-grade sterile air filtration and verified aseptic surgical protocols.',
  },
  {
    num: '05',
    title: 'Transparent Clinical Advice',
    desc: 'Honest diagnostic evaluations and clear treatment plans with zero hidden claims.',
  },
  {
    num: '06',
    title: 'Dedicated Latur Support',
    desc: 'Convenient OPD location at Shivaji Chowk, Ambejogai Road, Latur with prompt care.',
  },
];

export default function WhyChooseUs({ onOpenBooking }) {
  return (
    <section id="why-us" className="apple-why-section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }} className="reveal-on-scroll">
          <div className="apple-badge white">The Vimal Advantage</div>
          <h2 className="apple-h2" style={{ color: 'var(--pure-white)', marginTop: 16 }}>
            Designed for Clinical Excellence.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', marginTop: 12 }}>
            Engineered around patient safety, diagnostic accuracy, and surgical precision in Latur.
          </p>
        </div>

        <div className="apple-why-grid">
          {features.map((f, i) => (
            <div key={i} className={`apple-why-card reveal-on-scroll reveal-delay-${(i % 3) + 1}`}>
              <div className="apple-why-num">{f.num}</div>
              <div className="apple-why-title">{f.title}</div>
              <div className="apple-why-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlignment: 'center', marginTop: 56, display: 'flex', justifyContent: 'center' }} className="reveal-on-scroll">
          <button className="btn-apple-primary apple-pill-btn" onClick={onOpenBooking}>
            <Sparkles size={16} /> Book Appointment in Latur
          </button>
        </div>
      </div>
    </section>
  );
}
