import DOMPurify from 'dompurify';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class'],
};

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
}
