/**
 * MAIN CHAT HOOK
 */
import { useChatContext } from '../../contexts/ChatContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function useChat() {
  const chatCtx = useChatContext();
  const langCtx = useLanguage();

  return {
    ...chatCtx,
    ...langCtx,
  };
}
