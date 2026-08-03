import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickActions from './components/QuickActions';
import AboutSection from './components/AboutSection';
import TreatmentsSection from './components/TreatmentsSection';
import WhyChooseUs from './components/WhyChooseUs';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AIAssistant from './components/AIAssistant';
import { useScrollReveal } from './hooks/useScrollReveal';
import './App.css';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTreatmentId, setBookingTreatmentId] = useState(null);

  // Initialize smooth viewport scroll reveal animations
  useScrollReveal();

  // Toggle page recede scale effect when booking modal opens
  useEffect(() => {
    if (isBookingOpen) {
      document.body.classList.add('booking-modal-open');
    } else {
      document.body.classList.remove('booking-modal-open');
    }
    return () => document.body.classList.remove('booking-modal-open');
  }, [isBookingOpen]);

  const openBooking = (treatmentId = null) => {
    setBookingTreatmentId(treatmentId);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setBookingTreatmentId(null);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openAI = () => {
    const btn = document.querySelector('.ai-launcher-btn');
    if (btn) btn.click();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* NAV-001 */}
      <Header
        onOpenBooking={() => openBooking()}
        onNavigate={scrollTo}
      />

      <main>
        {/* HERO-001 */}
        <Hero
          onOpenBooking={() => openBooking()}
          onNavigate={scrollTo}
        />

        {/* QUICK-001 */}
        <QuickActions
          onOpenBooking={() => openBooking()}
          onOpenAI={openAI}
          onNavigate={scrollTo}
        />

        {/* ABOUT-001 */}
        <AboutSection onOpenBooking={() => openBooking()} />

        {/* TREAT-001 */}
        <TreatmentsSection
          onOpenBookingWithTreatment={(id) => openBooking(id)}
        />

        {/* WHY-001 */}
        <WhyChooseUs onOpenBooking={() => openBooking()} />

        {/* GALLERY-001 */}
        <GallerySection />

        {/* TEST-001 */}
        <TestimonialsSection />

        {/* CONTACT-001 */}
        <ContactSection onOpenBooking={() => openBooking()} />
      </main>

      {/* FOOTER-001 */}
      <Footer
        onNavigate={scrollTo}
        onOpenBooking={() => openBooking()}
      />

      {/* BOOK-MOD-001 */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        initialTreatmentId={bookingTreatmentId}
      />

      {/* AI-BOT-001 */}
      <AIAssistant onOpenBooking={() => openBooking()} />
    </div>
  );
}
