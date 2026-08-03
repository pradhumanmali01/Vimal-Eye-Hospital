import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { googleReviewsData } from '../data/googleReviews';

const AUTOPLAY_DELAY = 5000; // 5 seconds per slide

export default function TestimonialsSection() {
  const reviews = googleReviewsData;
  const total = reviews.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [animating, setAnimating] = useState(false);

  // Touch / swipe state
  const touchStartX = useRef(null);
  const autoplayRef = useRef(null);

  // ── Navigation helpers ───────────────────────────────────────────────────
  const goTo = useCallback((idx, dir = 'next') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx(idx);
      setAnimating(false);
    }, 320);
  }, [animating]);

  const prev = useCallback(() => {
    goTo((currentIdx - 1 + total) % total, 'prev');
  }, [currentIdx, total, goTo]);

  const next = useCallback(() => {
    goTo((currentIdx + 1) % total, 'next');
  }, [currentIdx, total, goTo]);

  // ── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) {
      clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, next]);

  // ── Touch / swipe ─────────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next(); else prev();
  };

  const current = reviews[currentIdx];

  // Animation style
  const slideStyle = {
    transition: animating ? 'opacity 0.32s ease, transform 0.32s ease' : 'none',
    opacity: animating ? 0 : 1,
    transform: animating
      ? direction === 'next' ? 'translateX(-20px)' : 'translateX(20px)'
      : 'translateX(0)',
  };

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
        <div
          className="apple-testimonial-glass-card reveal-on-scroll reveal-delay-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: 'grab', userSelect: 'none' }}
        >
          <div style={slideStyle}>
            {/* Star Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 'var(--r-pill)', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontSize: '0.875rem', fontWeight: 700, marginBottom: 24 }}>
              <Star size={16} fill="#F59E0B" />
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#F59E0B" style={{ marginLeft: i === 0 ? 4 : 1 }} />
              ))}
              <span style={{ marginLeft: 6 }}>Google Verified Review</span>
            </div>

            {/* Review Text */}
            <p className="apple-testimonial-quote">
              &ldquo;{current.review}&rdquo;
            </p>

            {/* Author */}
            <div className="apple-testimonial-author">
              <div className="apple-testimonial-avatar">
                {current.author.charAt(0).toUpperCase()}
              </div>
              <div className="apple-testimonial-meta">
                <strong>{current.author}</strong>
                <span>{current.time}&nbsp;·&nbsp;Latur, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 40 }}
          className="reveal-on-scroll reveal-delay-3"
        >
          <button
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={prev}
            aria-label="Previous review"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > currentIdx ? 'next' : 'prev')}
                aria-label={`Go to review ${i + 1}`}
                style={{
                  width: i === currentIdx ? 20 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i === currentIdx ? 'var(--apple-blue)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={next}
            aria-label="Next review"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', marginTop: 16, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          {currentIdx + 1} of {total} verified patient reviews
        </div>
      </div>
    </section>
  );
}
