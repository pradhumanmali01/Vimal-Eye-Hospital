import React, { useState } from 'react';
import { Compass, Sparkles, Eye, ArrowUpRight, Maximize2 } from 'lucide-react';
import { virtualTourRooms, virtualTourCategories } from '../data/virtualTourData';
import PanoramaViewer360 from './PanoramaViewer360';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Filter rooms
  const filteredRooms = activeCategory === 'All'
    ? virtualTourRooms
    : virtualTourRooms.filter((r) => r.category === activeCategory);

  const featuredRoom = virtualTourRooms.find((r) => r.featured) || virtualTourRooms[0];
  const gridRooms = filteredRooms.filter((r) => r.id !== (activeCategory === 'All' ? featuredRoom.id : null));

  return (
    <section id="gallery" className="apple-gallery-section">
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }} className="reveal-on-scroll">
          <div className="apple-badge">
            <Compass size={14} className="spin-slow" /> 360° Virtual Hospital Tour
          </div>
          <h2 className="apple-h2" style={{ marginTop: 16 }}>
            Explore Vimal Eye Hospital.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>
            Immerse yourself in our premier ophthalmic facilities in Latur through 360° equirectangular panoramas.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="apple-gallery-filters reveal-on-scroll reveal-delay-1">
          {virtualTourCategories.map((cat) => (
            <button
              key={cat}
              className={`apple-gallery-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} {cat === 'All' ? `(${virtualTourRooms.length})` : ''}
            </button>
          ))}
        </div>

        {/* Featured Hero Panorama Card (All category view) */}
        {activeCategory === 'All' && featuredRoom && (
          <div
            className="apple-treatments-featured-banner reveal-on-scroll reveal-delay-2"
            style={{ cursor: 'pointer', margin: '0 0 32px 0' }}
            onClick={() => setSelectedRoomId(featuredRoom.id)}
          >
            <div className="apple-tf-left">
              <div className="apple-badge white">
                <Sparkles size={14} /> Featured 360° Panorama
              </div>
              <h3 className="apple-tf-title">{featuredRoom.title}</h3>
              <p className="apple-tf-desc">{featuredRoom.description}</p>
              <div>
                <button className="btn-apple-primary apple-pill-btn">
                  <Compass size={18} /> Launch 360° Interactive Tour
                </button>
              </div>
            </div>
            <div className="apple-tf-right">
              <img src={featuredRoom.image} alt={featuredRoom.title} loading="lazy" decoding="async" />
              <div className="apple-hero-glass-overlay" />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(10, 16, 30, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--r-pill)',
                  padding: '12px 24px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                }}
              >
                <Compass size={20} className="spin-slow" style={{ color: '#60D4F4' }} /> Click to Explore 360°
              </div>
            </div>
          </div>
        )}

        {/* Masonry Panorama Grid */}
        <div className="apple-gallery-masonry">
          {gridRooms.map((room, idx) => (
            <div
              key={room.id}
              className={`apple-gallery-item reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
              onClick={() => setSelectedRoomId(room.id)}
            >
              <img src={room.image} alt={room.title} loading="lazy" decoding="async" />
              <div className="apple-gallery-overlay">
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60D4F4', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>
                    {room.category}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pure-white)' }}>
                    {room.title}
                  </div>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Compass size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 360° Equirectangular Fullscreen Viewer Portal */}
      {selectedRoomId && (
        <PanoramaViewer360
          initialRoomId={selectedRoomId}
          onClose={() => setSelectedRoomId(null)}
        />
      )}
    </section>
  );
}
