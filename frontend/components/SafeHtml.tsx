'use client';

import { useState, useEffect } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';

interface Props {
  html: string;
  className?: string;
}

export default function SafeHtml({ html, className }: Props) {
  const [safeHtml, setSafeHtml] = useState('');

  useEffect(() => {
    setSafeHtml(sanitizeHtml(html));
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
