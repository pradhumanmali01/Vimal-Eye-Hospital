/**
 * APPOINTMENT HOOK
 * Provides appointment initiation and flow control
 */
import { useChatContext } from '../../contexts/ChatContext';

export function useAppointment() {
  const { startAppointmentFlow, activeFlow, patientData } = useChatContext();
  return {
    startAppointmentFlow,
    isBookingActive: activeFlow === 'APPOINTMENT_FLOW',
    patientData,
  };
}
