import { getClip, formatTime, smart } from '@/lib/content';
import { VideoFacade } from './VideoFacade';

export function Clip({ id }: { id: string }) {
  const c = getClip(id);
  const ts = formatTime(c.start);
  const url = `https://www.youtube.com/watch?v=${c.youtubeId}&t=${c.start}s`;
  return (
    <figure className="clip" id={`clip-${c.id}`}>
      <div className="clip-head">
        <span className="clip-tag">Clip</span>
        <span className="clip-source">
          {c.podcast} · <span className="mono">{ts}</span>
        </span>
      </div>
      <blockquote className="clip-quote">
        <p>{smart(c.quote)}</p>
      </blockquote>
      <figcaption className="clip-who">
        <strong>{c.speaker}</strong>, {c.descriptor}
      </figcaption>
      <VideoFacade
        youtubeId={c.youtubeId}
        start={c.start}
        label={`${c.speaker} on ${c.podcast}`}
        timestamp={ts}
        episode={c.episode}
        url={url}
      />
    </figure>
  );
}
