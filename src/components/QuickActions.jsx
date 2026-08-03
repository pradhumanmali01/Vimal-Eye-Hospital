import React from 'react';
import { Calendar, Stethoscope, Bot, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const actions = [
  {
    icon: <Calendar size={22} />,
    title: 'Book Appointment',
    desc: 'Schedule your consultation in Latur',
    type: 'booking',
    delay: 'reveal-delay-1',
  },
  {
    icon: <Stethoscope size={22} />,
    title: 'Our Treatments',
    desc: 'Explore 10 specialized eye procedures',
    type: 'nav',
    id: 'treatments',
    delay: 'reveal-delay-2',
  },
  {
    icon: <Bot size={22} />,
    title: 'AI Eye Assistant',
    desc: 'Instant answers in EN, हिन्दी, मराठी',
    type: 'ai',
    delay: 'reveal-delay-3',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Hospital Location',
    desc: 'Shivaji Chowk, Ambejogai Rd, Latur',
    type: 'nav',
    id: 'contact',
    delay: 'reveal-delay-4',
  },
  {
    icon: <Phone size={22} />,
    title: 'Call Reception',
    desc: 'Speak directly with OPD staff',
    type: 'call',
    delay: 'reveal-delay-4',
  },
];

export default function QuickActions({ onOpenBooking, onOpenAI, onNavigate }) {
  const handleAction = (action) => {
    if (action.type === 'booking') onOpenBooking();
    else if (action.type === 'ai') onOpenAI();
    else if (action.type === 'nav') onNavigate(action.id);
    else if (action.type === 'call') window.location.href = 'tel:+919876543210';
  };

  return (
    <section id="quick-actions" className="apple-quick-section">
      <div className="container">
        <div className="apple-quick-grid">
          {actions.map((a, i) => (
            <div
              key={i}
              className={`apple-quick-tile reveal-on-scroll ${a.delay}`}
              onClick={() => handleAction(a)}
            >
              <div className="apple-quick-icon">{a.icon}</div>
              <div>
                <div className="apple-quick-title">{a.title}</div>
                <div className="apple-quick-desc">{a.desc}</div>
              </div>
              <ArrowUpRight size={18} style={{ color: 'var(--text-muted)', marginTop: 'auto', alignSelf: 'flex-end' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
