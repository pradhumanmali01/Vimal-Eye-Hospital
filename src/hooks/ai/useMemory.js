/**
 * SESSION MEMORY HOOK
 * Manages patient context & session state to prevent duplicate questions.
 */
import { useChatContext } from '../../contexts/ChatContext';

export function useMemory() {
  const { patientData } = useChatContext();
  return {
    patientData,
    hasName: Boolean(patientData.name),
    hasPhone: Boolean(patientData.phone),
    hasEmail: Boolean(patientData.email),
  };
}
