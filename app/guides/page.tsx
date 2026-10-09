import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides, getSteps } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/guides/',
  title: 'Job Search Guides and Templates · How to Get a Job',
  description:
    'Free job search templates and guides: salary expectations scripts, referral requests, forwardable intro emails, informational interviews and a job tracker.',
  type: 'website',
});

export default function GuidesIndex() {
  const guides = getGuides();
  const steps = getSteps();
  return (
    <div className="wrap narrow page">
      <h1 className="page-title">Guides and templates</h1>
      <p className="dek">
        Deeper dives on the parts of a job search people ask about most, each with word-for-word templates. They go
        with the steps of the course, but each one stands on its own.
      </p>
      <ol className="step-list guide-list">
        {guides.map((g) => {
          const step = steps.find((s) => s.slug === g.related);
          return (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}/`} className="step-row">
                <span className="step-main">
                  <span className="step-title">{g.title}</span>
                  <span className="step-dek">{g.dek}</span>
                </span>
                {step && <span className="step-time mono">Step {step.step}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
