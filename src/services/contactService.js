/**
 * ENQUIRY & CONTACT SERVICE
 * Calls POST /api/enquiry — dedicated enquiry endpoint (no age/gender required)
 * - On localhost: proxied by Vite to Express server (server/index.js)
 * - On Vercel:   handled by Vercel Serverless Function (api/enquiry.js)
 */

export const contactService = {
  async submitEnquiry(data) {
    try {
      console.log('[contactService] Submitting enquiry to /api/enquiry');

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          subject: data.subject || 'General OPD Enquiry',
          message: data.message || '',
        }),
      });

      // Always try to parse JSON for detailed error info
      let result = {};
      try {
        result = await response.json();
      } catch {
        // If response is not JSON (e.g., Vercel 404 HTML page)
        const text = await response.text().catch(() => '');
        console.error('[contactService] Non-JSON response:', response.status, text.slice(0, 200));
        throw new Error(`Server returned ${response.status}. The API endpoint may not be configured.`);
      }

      if (!response.ok || !result.success) {
        const errorMsg = result.message || `Server error (${response.status})`;
        console.error('[contactService] Server returned error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[contactService] Success:', result.message);
      return {
        success: true,
        message: result.message || 'Enquiry submitted successfully.',
      };

    } catch (err) {
      console.error('[contactService] Enquiry error:', err.message);
      return {
        success: false,
        message: err.message || 'Unable to send enquiry. Please call us directly.',
      };
    }
  },
};
