'use client';

import { useState } from 'react';

type Props = { youtubeId: string; start: number; label: string; timestamp: string; episode: string; url: string };

/** A compact play row that becomes the YouTube player, already cued to `start`, only when clicked. */
export function VideoFacade({ youtubeId, start, label, timestamp, episode, url }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <>
        <div className="video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${start}&autoplay=1&rel=0`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <a className="clip-out" href={url} target="_blank" rel="noopener noreferrer">
          {episode} <span aria-hidden="true">↗</span>
        </a>
      </>
    );
  }

  return (
    <div className="play-row">
      <button type="button" className="play-btn" onClick={() => setPlaying(true)} aria-label={`Play ${label} from ${timestamp}`}>
        <span className="play-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`} alt="" loading="lazy" />
          <span className="play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="play-text">
          <span className="play-cta mono">Play from {timestamp}</span>
          <span className="play-episode">{episode}</span>
        </span>
      </button>
      <a className="play-yt" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open on YouTube">
        YouTube <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
