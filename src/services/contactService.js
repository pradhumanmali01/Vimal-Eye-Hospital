/**
 * ENQUIRY & CONTACT SERVICE
 * Reuses existing POST /api/appointment backend endpoint
 */

export const contactService = {
  async submitEnquiry(data) {
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          treatment: data.subject || 'General Enquiry',
          date: new Date().toISOString().split('T')[0],
          time: 'General OPD',
          message: data.message || 'Enquiry via AI Assistant',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Server error submitting enquiry');
      }

      return {
        success: true,
        message: result.message || 'Enquiry submitted successfully.',
      };
    } catch (err) {
      console.error('[contactService] Enquiry error:', err);
      return {
        success: false,
        message: err.message || 'Unable to send enquiry right now.',
      };
    }
  },
};
