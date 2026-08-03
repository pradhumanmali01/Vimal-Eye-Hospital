import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { googleReviewsData } from '../data/googleReviews';

export default function TestimonialsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const reviews = googleReviewsData;
  const total = reviews.length;

  const prev = () => setCurrentIdx(i => (i - 1 + total) % total);
  const next = () => setCurrentIdx(i => (i + 1) % total);

  const current = reviews[currentIdx];

  return (
    <section id="testimonials" className="apple-testimonials-section">
      <div className="container">
        <div className="apple-badge white reveal-on-scroll" style={{ marginBottom: 16 }}>
          Patient Experience
        </div>

        <h2 className="apple-h2 reveal-on-scroll reveal-delay-1" style={{ color: 'var(--pure-white)', marginBottom: 48 }}>
          Trusted by Patients in Latur.
        </h2>

        {/* VisionOS Floating Glass Testimonial Card */}
        <div className="apple-testimonial-glass-card reveal-on-scroll reveal-delay-2">
          {/* Star Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 'var(--r-pill)', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontSize: '0.875rem', fontWeight: 700, marginBottom: 24 }}>
            <Star size={16} fill="#F59E0B" /> 5.0 Google Verified Review
          </div>

          {/* Review Text */}
          <p className="apple-testimonial-quote">
            "{current.review}"
          </p>

          {/* Author */}
          <div className="apple-testimonial-author">
            <div className="apple-testimonial-avatar">
              {current.author.charAt(0)}
            </div>
            <div className="apple-testimonial-meta">
              <strong>{current.author}</strong>
              <span>{current.badge || 'Verified Patient'} &nbsp;·&nbsp; {current.location}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 40 }} className="reveal-on-scroll reveal-delay-3">
          <button
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={prev}
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 600 }}>
            {currentIdx + 1} of {total}
          </span>
          <button
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={next}
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
