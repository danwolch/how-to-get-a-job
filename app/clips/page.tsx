import type { Metadata } from 'next';
import Link from 'next/link';
import { getSteps, clipIdsIn, getClip, pad } from '@/lib/content';
import { Clip } from '@/components/Clip';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/clips/',
  title: 'Job Search Advice From Hiring Managers: Podcast Clips',
  description:
    'Job search advice from recruiters, hiring managers and authors, in short podcast clips queued to the exact moment: networking, resumes, interviews, offers.',
  type: 'website',
});

export default function ClipsPage() {
  const steps = getSteps();
  return (
    <div className="wrap narrow page">
      <h1 className="page-title">Every clip</h1>
      <p className="dek">
        Each player starts at the moment the quote begins. They’re cut from long conversations, so the context
        before and after is usually worth hearing too.
      </p>
      {steps.map((s) => {
        const ids = clipIdsIn(s.body);
        if (!ids.length) return null;
        return (
          <section key={s.slug} className="clip-group">
            <h2 className="clip-group-title">
              <span className="mono">{pad(s.step)}</span>
              <Link href={`/${s.slug}/`}>{s.title}</Link>
            </h2>
            {ids.map((id) => (
              <Clip key={id} id={getClip(id).id} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
