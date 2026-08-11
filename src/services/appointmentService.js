/**
 * APPOINTMENT SUBMISSION SERVICE
 * Calls POST /api/appointment
 * - On localhost: proxied by Vite to Express server (server/index.js)
 * - On Vercel:   handled by Vercel Serverless Function (api/appointment.js)
 */

export const appointmentService = {
  async prepareAppointment(data) {
    try {
      console.log('[appointmentService] Preparing booking session via /api/appointment?action=prepare');
      const response = await fetch('/api/appointment?action=prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || '',
          treatment: data.treatment || 'General OPD Enquiry',
          date: data.date,
          time: data.time,
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        throw new Error(`Server returned ${response.status}. Endpoint not available.`);
      }

      if (!response.ok || !result.success) {
        const msg = result.message || (result.errors ? Object.values(result.errors).join(', ') : 'Preparation failed.');
        throw new Error(msg);
      }

      return {
        success: true,
        bookingAuthToken: result.bookingAuthToken,
        expiresAt: result.expiresAt,
      };
    } catch (err) {
      console.error('[appointmentService] Prepare error:', err.message);
      return {
        success: false,
        message: err.message || 'Unable to prepare appointment booking session.',
      };
    }
  },

  async submitAppointment(data, bookingAuthToken) {
    try {
      console.log('[appointmentService] Submitting appointment to /api/appointment');

      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || '',
          treatment: data.treatment || 'General OPD Enquiry',
          date: data.date,
          time: data.time,
          message: data.message || 'Booked via AI Assistant',
          bookingAuthToken: bookingAuthToken || data.bookingAuthToken,
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        const text = await response.text().catch(() => '');
        console.error('[appointmentService] Non-JSON response:', response.status, text.slice(0, 200));
        throw new Error(`Server returned ${response.status}. The API endpoint may not be configured.`);
      }

      if (!response.ok || !result.success) {
        const errorMsg = result.message || `Server error (${response.status})`;
        console.error('[appointmentService] Server returned error:', errorMsg, result.errors || '');
        throw new Error(errorMsg);
      }

      console.log('[appointmentService] Success:', result.message);
      return {
        success: true,
        message: result.message || 'Appointment request submitted successfully.',
      };

    } catch (err) {
      console.error('[appointmentService] Submission error:', err.message);
      return {
        success: false,
        message: err.message || 'Unable to submit appointment. Please call us directly.',
      };
    }
  },
};
