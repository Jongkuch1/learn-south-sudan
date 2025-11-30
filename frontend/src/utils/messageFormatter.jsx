import React from 'react';

// Escape HTML to avoid XSS
export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Convert URLs to <a> and preserve newlines as <br/>
export function formatMessageToNodes(text = '') {
  const safe = escapeHtml(text);
  // simple url regex (http/https)
  const urlRegex = /((https?:\/\/[^\s]+))/g;
  // split by newline to keep line breaks
  const lines = safe.split('\n');
  const nodes = [];

  lines.forEach((line, i) => {
    // split by links
    const parts = line.split(urlRegex);
    parts.forEach((part, idx) => {
      if (!part) return;
      if (urlRegex.test(part)) {
        // ensure href is unescaped original url
        const href = part;
        nodes.push(
          <a key={`a-${i}-${idx}`} href={href} target="_blank" rel="noopener noreferrer">
            {href}
          </a>
        );
      } else {
        nodes.push(<span key={`t-${i}-${idx}`}>{part}</span>);
      }
    });
    if (i < lines.length - 1) nodes.push(<br key={`br-${i}`} />);
  });

  return nodes;
}
