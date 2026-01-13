'use client';

import { useEffect, useRef } from 'react';

export function useLockScroll(lock: boolean = true) {
  const scrollY = useRef(0);
  const scrollBarWidth = useRef(0);

  useEffect(() => {
    if (!lock) return;

    // Save scroll position
    scrollY.current = window.scrollY;
    scrollBarWidth.current = window.innerWidth - document.documentElement.clientWidth;

    // Blok scroll
    const body = document.body;
    const html = document.documentElement;

    const originalBodyOverflow = body.style.overflow;
    const originalBodyPaddingRight = body.style.paddingRight;
    const originalHtmlOverflow = html.style.overflow;

    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollBarWidth.current}px`;
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY.current}px`;
    body.style.width = '100%';

    return () => {
      // Restoring
      body.style.overflow = originalBodyOverflow;
      body.style.paddingRight = originalBodyPaddingRight;
      html.style.overflow = originalHtmlOverflow;
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';

      window.scrollTo(0, scrollY.current);
    };
  }, [lock]);
}