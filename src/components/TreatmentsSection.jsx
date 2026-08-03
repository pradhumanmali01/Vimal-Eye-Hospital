import React, { useState } from 'react';
import { Eye, Zap, Activity, Baby, CircleDot, Droplet, Scan, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { treatmentsData } from '../data/treatments';
import TreatmentModal from './TreatmentModal';
import opImg from '../assets/operation_theatre.png';

const treatmentIcons = {
  cataract: <Eye size={24} />,
  lasik: <Zap size={24} />,
  glaucoma: <Activity size={24} />,
  retina: <Scan size={24} />,
  pediatric: <Baby size={24} />,
  cornea: <CircleDot size={24} />,
  dryeye: <Droplet size={24} />,
  diabetic: <Activity size={24} />,
  general: <Eye size={24} />,
  emergency: <AlertCircle size={24} />,
};

const featuredId = 'cataract';

export default function TreatmentsSection({ onOpenBookingWithTreatment }) {
  const [selectedId, setSelectedId] = useState(null);

  const featured = treatmentsData.find(t => t.id === featuredId);
  const gridItems = treatmentsData.filter(t => t.id !== featuredId);
  const selectedTreatment = treatmentsData.find(t => t.id === selectedId);

  return (
    <section id="treatments" className="apple-treatments-section">
      <div className="container">
        {/* Header */}
        <div className="apple-treatments-header reveal-on-scroll">
          <div className="apple-badge">Specialized Procedures</div>
          <h2 className="apple-h2" style={{ marginTop: 16 }}>
            Advanced Ophthalmic Care.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: 12 }}>
            Surgical and therapeutic procedures backed by modern diagnostic technology.
          </p>
        </div>

        {/* Featured VisionOS Banner */}
        {featured && (
          <div className="apple-treatments-featured-banner reveal-on-scroll reveal-delay-1">
            <div className="apple-tf-left">
              <div className="apple-badge white">{featured.category}</div>
              <h3 className="apple-tf-title">{featured.title}</h3>
              <p className="apple-tf-desc">{featured.shortDescription}</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  className="btn-apple-primary apple-pill-btn"
                  onClick={() => setSelectedId(featured.id)}
                >
                  <Sparkles size={16} /> Explore Details
                </button>
                <button
                  className="btn-apple-dark-glass apple-pill-btn"
                  onClick={() => onOpenBookingWithTreatment(featured.id)}
                >
                  Book Cataract Surgery
                </button>
              </div>
            </div>
            <div className="apple-tf-right">
              <img src={opImg} alt={featured.title} loading="lazy" decoding="async" />
            </div>
          </div>
        )}

        {/* Floating Glass Grid */}
        <div className="apple-treatment-grid">
          {gridItems.map((t, i) => (
            <div
              key={t.id}
              className={`apple-treatment-glass-card reveal-on-scroll reveal-delay-${(i % 3) + 1}`}
              onClick={() => setSelectedId(t.id)}
            >
              <div className="apple-tc-icon">{treatmentIcons[t.id] || <Eye size={24} />}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {t.category}
              </div>
              <div className="apple-tc-title">{t.title}</div>
              <div className="apple-tc-desc">{t.shortDescription}</div>
              <div className="apple-tc-link">
                View Details <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTreatment && (
        <TreatmentModal
          treatment={selectedTreatment}
          onClose={() => setSelectedId(null)}
          onBook={() => {
            setSelectedId(null);
            onOpenBookingWithTreatment(selectedTreatment.id);
          }}
        />
      )}
    </section>
  );
}
