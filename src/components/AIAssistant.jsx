import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'mr', label: 'म' },
];

const INITIAL_MESSAGES = {
  en: 'Hello! I\'m the Vimal Eye Hospital AI Assistant. How can I help you today?',
  hi: 'नमस्ते! मैं विमल आई हॉस्पिटल का AI सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?',
  mr: 'नमस्कार! मी विमल आय हॉस्पिटलचा AI सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
};

const RESPONSES = {
  en: {
    default: 'For detailed medical information or appointment scheduling in Latur, please call +91 98765 43210 or use our online booking wizard.',
    'opd timings': 'Our OPD at Shivaji Chowk, Latur is open Monday to Saturday from 9:00 AM to 8:00 PM. 24/7 Emergency helpline: +91 98765 43211.',
    'cataract surgery': 'We perform micro-incision phacoemulsification with premium foldable IOL implantation under topical numbing drops.',
    'lasik surgery': 'LASIK laser vision correction is available for eligible candidates 18+ with stable refractive numbers.',
  },
  hi: {
    default: 'विस्तृत जानकारी या लातूर में अपॉइंटमेंट के लिए +91 98765 43210 पर कॉल करें।',
    'opd समय': 'शिवाजी चौक, लातूर में OPD सोमवार से शनिवार सुबह 9:00 से शाम 8:00 बजे तक खुला है।',
  },
  mr: {
    default: 'तपशीलवार माहितीसाठी किंवा लातूरमध्ये अपॉइंटमेंटसाठी +91 98765 43210 वर कॉल करा.',
    'opd वेळ': 'शिवाजी चौक, लातूर येथील OPD सोमवार ते शनिवार सकाळी 9:00 ते सायंकाळी 8:00 पर्यंत उघडे असते.',
  },
};

export default function AIAssistant({ onOpenBooking }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([{ from: 'bot', text: INITIAL_MESSAGES['en'] }]);
  const [input, setInput] = useState('');

  const switchLang = (code) => {
    setLang(code);
    setMessages([{ from: 'bot', text: INITIAL_MESSAGES[code] }]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    setMessages(m => [...m, { from: 'user', text: txt }]);
    setTimeout(() => {
      const key = txt.toLowerCase();
      const res = RESPONSES[lang][key] || RESPONSES[lang]['default'];
      setMessages(m => [...m, { from: 'bot', text: res }]);
    }, 600);
  };

  return (
    <>
      <button
        className="ai-launcher-btn"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 2500,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--apple-blue)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(0, 113, 227, 0.45)',
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 28,
            zIndex: 2500,
            width: 360,
            maxHeight: '70vh',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 'var(--r-2xl)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', background: 'var(--dark-void)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={18} style={{ color: 'var(--apple-blue)' }} />
              <strong style={{ fontSize: '0.9rem' }}>Vimal Eye Assistant</strong>
            </div>
            <button style={{ color: 'white' }} onClick={() => setOpen(false)}><X size={16} /></button>
          </div>

          <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.03)', display: 'flex', gap: 6 }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => switchLang(l.code)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--r-pill)',
                  background: lang === l.code ? 'var(--apple-blue)' : 'white',
                  color: lang === l.code ? 'white' : 'var(--text-muted)',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-lg)',
                  fontSize: '0.875rem',
                  alignSelf: m.from === 'bot' ? 'flex-start' : 'flex-end',
                  background: m.from === 'bot' ? 'rgba(0,0,0,0.05)' : 'var(--apple-blue)',
                  color: m.from === 'bot' ? 'var(--text-dark-primary)' : 'white',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--r-pill)', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '0.875rem' }}
            />
            <button style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--apple-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={sendMessage}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
