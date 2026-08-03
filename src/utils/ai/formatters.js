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

export function parseMarkdownLinks(text) {
  if (!text) return text;
  
  // Convert [Text](url) to HTML clickable links
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(markdownLinkRegex, (match, label, url) => {
    const isExternal = url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:');
    const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}" ${targetAttr} class="chat-link">${label}</a>`;
  });
}
