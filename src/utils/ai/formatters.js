/**
 * FORMATTERS FOR AI ASSISTANT MESSAGES & LINKS
 */

export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Escapes HTML characters to prevent XSS attacks
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parses markdown links safely by escaping raw HTML first,
 * then replacing valid markdown link patterns with sanitized <a> tags.
 * Only http, https, tel, and mailto protocols are permitted.
 */
export function parseMarkdownLinks(text) {
  if (!text) return '';
  
  // 1. Escape all HTML tags & entities first
  const safeText = escapeHtml(text);

  // 2. Convert [Text](url) to HTML clickable links safely
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return safeText.replace(markdownLinkRegex, (match, label, rawUrl) => {
    const cleanUrl = rawUrl.trim();
    const lowerUrl = cleanUrl.toLowerCase();
    
    // Strict URL Protocol Whitelist
    const isAllowedProtocol = 
      lowerUrl.startsWith('http://') ||
      lowerUrl.startsWith('https://') ||
      lowerUrl.startsWith('tel:') ||
      lowerUrl.startsWith('mailto:');

    if (!isAllowedProtocol) {
      // Disallowed protocol (javascript:, data:, vbscript:) -> render as plain text
      return `[${label}](${cleanUrl})`;
    }

    const targetAttr = 'target="_blank" rel="noopener noreferrer"';
    return `<a href="${cleanUrl}" ${targetAttr} class="chat-link">${label}</a>`;
  });
}

