/**
 * STREAMING MESSAGE COMPONENT
 * Renders character by character typing animation for AI responses
 */
import React from 'react';
import { useTyping } from '../../hooks/ai/useTyping';
import { parseMarkdownLinks } from '../../utils/ai/formatters';

export default function StreamingMessage({ text }) {
  const { displayedText } = useTyping(text, 10, true);
  const htmlContent = parseMarkdownLinks(displayedText);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ lineHeight: 1.5 }}
    />
  );
}
