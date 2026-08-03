import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import officialLogo from '../assets/logo2.jpg';

const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Treatments', id: 'treatments' },
  { label: 'Why Us', id: 'why-us' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Reviews', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

export default function Header({ onOpenBooking, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setDrawerOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Floating Centered Glass Navbar */}
      <div className="apple-nav-wrapper">
        <nav className={`apple-nav-pill ${scrolled ? 'scrolled' : ''}`}>
          {/* Logo */}
          <div className="apple-logo-wrap" onClick={() => handleNavClick('hero')}>
            <img src={officialLogo} alt="Vimal Eye Hospital" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Links */}
          <div className="apple-nav-links">
            {navItems.map(({ label, id }) => (
              <button
                key={id}
                className="apple-nav-link"
                onClick={() => handleNavClick(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="apple-nav-right">
            <button className="apple-nav-cta" onClick={onOpenBooking}>
              <Sparkles size={15} /> Book Appointment
            </button>
            <button
              className="apple-mobile-toggle"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle menu"
            >
              {drawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div
            className="apple-drawer-overlay visible"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="apple-mobile-drawer open">
            <div className="apple-drawer-header">
              <img src={officialLogo} alt="Vimal Eye Hospital" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
              <button
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="apple-drawer-links">
              {navItems.map(({ label, id }) => (
                <button key={id} onClick={() => handleNavClick(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <button className="btn-apple-primary apple-pill-btn" style={{ width: '100%' }} onClick={() => { setDrawerOpen(false); onOpenBooking(); }}>
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
