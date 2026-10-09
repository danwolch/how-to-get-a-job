'use client';

import { useState } from 'react';

/** Section permalink: navigates to the anchor and copies the full URL. */
export function CopyLink({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <a
      href={`#${id}`}
      className={`permalink${done ? ' is-copied' : ''}`}
      aria-label="Copy link to this section"
      onClick={() => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard?.writeText(url).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        });
      }}
    >
      {done ? 'Link copied' : '#'}
    </a>
  );
}
