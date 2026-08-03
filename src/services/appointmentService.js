/**
 * APPOINTMENT SUBMISSION SERVICE
 * Reuses existing POST /api/appointment backend endpoint
 */

export const appointmentService = {
  async submitAppointment(data) {
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          treatment: data.treatment || 'General OPD Enquiry',
          date: data.date || new Date().toISOString().split('T')[0],
          time: data.time || '10:00 AM',
          message: data.message || `Booked via AI Assistant (Age: ${data.age || 'N/A'}, Gender: ${data.gender || 'N/A'})`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Server error submitting appointment');
      }

      return {
        success: true,
        message: result.message || 'Appointment request submitted successfully.',
      };
    } catch (err) {
      console.error('[appointmentService] Submission error:', err);
      return {
        success: false,
        message: err.message || 'Unable to submit appointment right now.',
      };
    }
  },
};
