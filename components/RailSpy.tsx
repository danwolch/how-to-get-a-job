'use client';

import { useEffect } from 'react';

/** Marks the rail link for the section currently being read. */
export function RailSpy() {
  useEffect(() => {
    const links = new Map<string, Element>();
    document.querySelectorAll('.rail-sections a[href^="#"]').forEach((a) => links.set(a.getAttribute('href')!.slice(1), a));
    if (!links.size || !('IntersectionObserver' in window)) return;
    let current: Element | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          current?.classList.remove('is-active');
          current = links.get(e.target.id);
          current?.classList.add('is-active');
        }
      },
      { rootMargin: '-15% 0px -75% 0px' },
    );
    document.querySelectorAll('.prose h2[id]').forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);
  return null;
}
