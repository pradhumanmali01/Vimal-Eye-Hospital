/**
 * HOSPITAL QUERY SERVICE
 * Strict data lookup from hospitalConfig.js (Zero hallucination policy)
 */
import { hospitalConfig } from '../data/hospitalConfig';

export const hospitalService = {
  getConfig() {
    return hospitalConfig;
  },

  getDoctors() {
    return hospitalConfig.doctors;
  },

  getTreatments() {
    return hospitalConfig.treatments;
  },

  getTreatmentById(id) {
    return hospitalConfig.treatments.find(t => t.id === id);
  },

  getTimings() {
    return hospitalConfig.timings;
  },

  getContact() {
    return hospitalConfig.contact;
  },

  getFees() {
    return hospitalConfig.fees;
  },

  getFaqs() {
    return hospitalConfig.faqs;
  },

  findFaqMatch(query) {
    const q = (query || '').toLowerCase();
    return hospitalConfig.faqs.find(item => 
      q.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(q)
    );
  },
};
