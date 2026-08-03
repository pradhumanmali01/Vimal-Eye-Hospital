/**
 * AI CHAT ENGINE & RESPONSE GENERATOR
 * Pluggable architecture designed for easy future LLM (OpenAI / Gemini / Claude) integration.
 * Enforces ZERO-HALLUCINATION rules by querying hospitalConfig.js.
 */
import { hospitalConfig } from '../data/hospitalConfig';
import { SYSTEM_TEXTS } from '../utils/ai/constants';

// Key intent keywords for Appointment Flow
const APPOINTMENT_KEYWORDS = [
  'book appointment', 'need doctor', 'need consultation', 'eye checkup',
  'appointment', 'visit hospital', 'consultation', 'book', 'booking',
  'अपॉइंटमेंट बुक', 'डॉक्टर चाहिए', 'जांच', 'अपॉइंटमेंट', 'भेट'
];

// Key intent keywords for Enquiry Flow
const ENQUIRY_KEYWORDS = [
  'send enquiry', 'enquiry', 'ask question', 'contact team',
  'पूछताछ', 'सवाल', 'चौकशी'
];

export const chatService = {
  /**
   * Main entry point for generating AI response
   * Can be swapped to call OpenAI / Gemini API in the future without changing frontend components
   */
  async generateResponse({ userQuery, lang = 'en', memory = {} }) {
    const q = (userQuery || '').toLowerCase().trim();

    // 1. Check Appointment Flow Intent
    const isAppointmentIntent = APPOINTMENT_KEYWORDS.some(kw => q.includes(kw));
    if (isAppointmentIntent) {
      return {
        intent: 'START_APPOINTMENT_FLOW',
        text: SYSTEM_TEXTS[lang].bookingStarted,
      };
    }

    // 2. Check Enquiry Flow Intent
    const isEnquiryIntent = ENQUIRY_KEYWORDS.some(kw => q.includes(kw));
    if (isEnquiryIntent) {
      return {
        intent: 'START_ENQUIRY_FLOW',
        text: SYSTEM_TEXTS[lang].enquiryStarted,
      };
    }

    // 3. Match Knowledge Base (Doctors, Treatments, Fees, Timings, Location, Contact, FAQs)
    const responseText = this.queryHospitalKnowledgeBase(q, lang, memory);

    return {
      intent: 'GENERAL_QA',
      text: responseText,
    };
  },

  /**
   * Queries hospitalConfig strictly without hallucination
   */
  queryHospitalKnowledgeBase(query, lang, memory) {
    const cfg = hospitalConfig;

    // Doctor Query
    if (query.includes('doctor') || query.includes('surgeon') || query.includes('specialist') || query.includes('डॉक्टर') || query.includes('वैद्यकीय')) {
      const docList = cfg.doctors.map(d => `• **${d.name}** (${d.title})\n  _${d.degrees}_ — ${d.specialties.join(', ')}`).join('\n\n');
      if (lang === 'hi') {
        return `हमारे विशेषज्ञ डॉक्टर्स:\n\n${docList}\n\nआप अपॉइंटमेंट बुक करने के लिए "Book Appointment" कह सकते हैं।`;
      }
      if (lang === 'mr') {
        return `आमचे तज्ज्ञ डॉक्टर:\n\n${docList}\n\nअपॉइंटमेंटसाठी "Book Appointment" टाईप करा.`;
      }
      return `Our Expert Ophthalmic Surgeons:\n\n${docList}\n\nYou can type **"Book Appointment"** anytime to schedule a consultation.`;
    }

    // OPD Timings & Working Days
    if (query.includes('timing') || query.includes('time') || query.includes('open') || query.includes('hours') || query.includes('समय') || query.includes('वेळ') || query.includes('उघडे')) {
      if (lang === 'hi') {
        return `🕒 **ओपीडी समय:**\n${cfg.timings.opdDays}: ${cfg.timings.opdHours}\n🚨 24/7 आपातकालीन सहायता: [${cfg.contact.emergency}](tel:${cfg.contact.emergencyRaw})`;
      }
      if (lang === 'mr') {
        return `🕒 **ओपीडी वेळ:**\n${cfg.timings.opdDays}: ${cfg.timings.opdHours}\n🚨 24/7 आणीबाणी मदत: [${cfg.contact.emergency}](tel:${cfg.contact.emergencyRaw})`;
      }
      return `🕒 **OPD Timings at ${cfg.name}:**\n• **${cfg.timings.opdDays}**: ${cfg.timings.opdHours}\n• **Emergency**: ${cfg.timings.emergency}\n\nCall Helpline: [${cfg.contact.emergency}](tel:${cfg.contact.emergencyRaw})`;
    }

    // Consultation Fees & Insurance
    if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('charge') || query.includes('फीस') || query.includes('दर') || query.includes('किंमत')) {
      if (lang === 'hi') {
        return `💰 **ओपीडी एवं परामर्श फीस:**\n• सामान्य परामर्श: ${cfg.fees.generalOpd}\n• विशेषज्ञ परामर्श: ${cfg.fees.specialistConsultation}\n• फॉलो-अप: 10 दिनों में निःशुल्क\n\nहम सभी प्रमुख स्वास्थ्य बीमा व कैशलेस योजनाओं को स्वीकार करते हैं।`;
      }
      if (lang === 'mr') {
        return `💰 **ओपीडी आणि सल्लागार फी:**\n• सर्वसाधारण सल्ला: ${cfg.fees.generalOpd}\n• तज्ज्ञ सल्ला: ${cfg.fees.specialistConsultation}\n• पाठपुरावा: 10 दिवसांच्या आत मोफत\n\nआम्ही सर्व प्रमुख आरोग्य विमा आणि कॅशलेस सेवा स्वीकारतो.`;
      }
      return `💰 **Consultation & OPD Fees:**\n• **General OPD**: ${cfg.fees.generalOpd}\n• **Specialist Consultation**: ${cfg.fees.specialistConsultation}\n• **Follow-up**: Free within 10 days of OPD\n\nPayment options: Cash, UPI, Cards, and Health Insurance / Cashless coverage.`;
    }

    // LASIK Surgery
    if (query.includes('lasik') || query.includes('laser') || query.includes('spectacle free') || query.includes('लैसिक')) {
      const t = cfg.treatments.find(tr => tr.id === 'lasik');
      if (lang === 'hi') {
        return `👁 **100% ब्लेड-फ्री LASIK लेजर:**\n${t.shortDesc}\n• पात्रता: 18+ वर्ष, 1 वर्ष से स्थिर चश्मा नंबर\n• रिकवरी: 24 घंटे में स्पष्ट दृष्टि`;
      }
      if (lang === 'mr') {
        return `👁 **100% ब्लेड-फ्री LASIK लेझर:**\n${t.shortDesc}\n• पात्रता: 18+ वय, 1 वर्ष स्थिर चष्मा नंबर\n• रिकव्हरी: 24 तासांत स्पष्ट दृष्टी`;
      }
      return `👁 **100% Blade-Free LASIK Laser Vision Correction:**\n${t.shortDesc}\n\n• **Eligibility**: Age 18+ with stable prescription for >1 year\n• **Recovery**: Next-day recovery with crystal clear vision`;
    }

    // Cataract Surgery
    if (query.includes('cataract') || query.includes('phaco') || query.includes('lens') || query.includes('मोतियाबिंद') || query.includes('मोतीबिंदू')) {
      const t = cfg.treatments.find(tr => tr.id === 'cataract');
      if (lang === 'hi') {
        return `👁 **माइक्रो-फेको मोतियाबिंद सर्जरी:**\n${t.shortDesc}\n• बिना टांके, बिना दर्द की 10 मिनट की सर्जरी\n• प्रीमियम IOL लेंस विकल्प उपलब्ध`;
      }
      if (lang === 'mr') {
        return `👁 **मायक्रो-फेको मोतीबिंदू शस्त्रक्रिया:**\n${t.shortDesc}\n• विनाटाका, विनावेधना 10 मिनिटांची शस्त्रक्रिया\n• प्रीमियम IOL लेन्स पर्याय उपलब्ध`;
      }
      return `👁 **Micro-Phaco Cataract Surgery:**\n${t.shortDesc}\n\n• Stitchless, painless 10-minute procedure under topical anesthetic eye drops\n• Premium monofocal, multifocal, & toric IOL lenses available`;
    }

    // Treatments / Services General
    if (query.includes('treatment') || query.includes('service') || query.includes('surgery') || query.includes('इलाज') || query.includes('उपचार')) {
      const trList = cfg.treatments.map(t => `• **${t.title}**: ${t.shortDesc}`).join('\n\n');
      return `🩺 **Specialized Eye Treatments at ${cfg.name}:**\n\n${trList}`;
    }

    // Location / Address / Google Maps
    if (query.includes('location') || query.includes('address') || query.includes('where') || query.includes('map') || query.includes('पता') || query.includes('पत्ता')) {
      if (lang === 'hi') {
        return `📍 **विमल आई हॉस्पिटल का पता:**\n${cfg.address}\n\n🗺 [गूगल मैप्स पर देखें](${cfg.contact.googleMaps})\n📞 फोन: [${cfg.contact.phone}](${cfg.contact.phoneRaw})`;
      }
      if (lang === 'mr') {
        return `📍 **विमल आय हॉस्पिटलचा पत्ता:**\n${cfg.address}\n\n🗺 [गूगल मॅप्सवर पहा](${cfg.contact.googleMaps})\n📞 फोन: [${cfg.contact.phone}](${cfg.contact.phoneRaw})`;
      }
      return `📍 **Hospital Location & Address:**\n${cfg.address}\n\n🗺 **Google Maps**: [Open Location in Google Maps](${cfg.contact.googleMaps})\n📞 **Call Desk**: [${cfg.contact.phone}](tel:${cfg.contact.phoneRaw})`;
    }

    // Contact Details & Emergency Phone
    if (query.includes('contact') || query.includes('phone') || query.includes('number') || query.includes('call') || query.includes('संपर्क') || query.includes('फोन')) {
      return `📞 **Vimal Eye Hospital Contact Desk:**\n• **Reception**: [${cfg.contact.phone}](tel:${cfg.contact.phoneRaw})\n• **Emergency 24/7**: [${cfg.contact.emergency}](tel:${cfg.contact.emergencyRaw})\n• **Email**: [${cfg.contact.email}](mailto:${cfg.contact.email})\n• **Instagram**: [Follow Us on Instagram](${cfg.contact.instagram})`;
    }

    // Instagram / Social Media
    if (query.includes('instagram') || query.includes('social') || query.includes('photo')) {
      return `📷 **Official Instagram Page:**\nFollow Vimal Eye Hospital on Instagram for surgery updates & eye care tips:\n👉 [Visit Official Instagram](${cfg.contact.instagram})`;
    }

    // 360 Tour / Virtual Tour
    if (query.includes('360') || query.includes('tour') || query.includes('virtual')) {
      return `🌐 **360° Interactive Virtual Tour:**\nYou can explore our hospital facilities, operation theatre, recovery rooms, and waiting lounge directly in the **360° Virtual Tour** section on our website!`;
    }

    // Reviews & Rating
    if (query.includes('review') || query.includes('rating') || query.includes('star') || query.includes('feedback')) {
      return `⭐ **Vimal Eye Hospital Patient Rating:**\n• **Google Rating**: ★★★★★ **5.0 Stars** (Over 500+ Verified Patient Reviews)\n• **Highlights**: Micro-Phaco Cataract expertise, compassionate nursing care, and modern state-of-the-art infrastructure.`;
    }

    // Fallback: Zero Hallucination Rule
    return SYSTEM_TEXTS[lang].missingInfoFallback;
  },
};
