/**
 * STREAMING TYPING HOOK
 * Simulates ChatGPT character streaming for AI responses
 */
import { useState, useEffect } from 'react';

export function useTyping(fullText, speed = 12, enabled = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!enabled);

  useEffect(() => {
    if (!enabled || !fullText) {
      setDisplayedText(fullText || '');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [fullText, speed, enabled]);

  return { displayedText, isComplete };
}
