import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/Mdx';
import { StepRail } from '@/components/StepRail';
import { getSteps, getStep, getHeadings, getGuides, clipIdsIn, pad } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, stepJsonLd } from '@/components/JsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
  return getSteps().map((s) => ({ step: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ step: string }> }): Promise<Metadata> {
  const s = getStep((await params).step);
  if (!s) return {};
  return pageMetadata({ path: `/${s.slug}/`, title: s.seoTitle ?? `${s.title} · How to Get a Job`, description: s.seoDescription ?? s.dek, image: `/og/${s.slug}.png` });
}

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step: slug } = await params;
  const steps = getSteps();
  const i = steps.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const s = steps[i];
  const prev = steps[i - 1];
  const next = steps[i + 1];
  const headings = getHeadings(s);
  const guides = getGuides().filter((g) => g.related === s.slug);
  const clipCount = clipIdsIn(s.body).length;

  return (
    <div className="wrap step-layout">
      <JsonLd data={stepJsonLd(s, steps.length)} />
      <StepRail steps={steps} current={s.slug} headings={headings} />
      <article className="step">
        <header className="step-head">
          <h1>{s.title}</h1>
          <p className="dek">{s.dek}</p>
          <dl className="step-meta">
            <div>
              <dt>Step</dt>
              <dd>
                {s.step} of {steps.length}
                {s.optional && ', optional'}
              </dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{s.time}</dd>
            </div>
            <div>
              <dt>Clips</dt>
              <dd>{clipCount}</dd>
            </div>
            <div>
              <dt>Read as</dt>
              <dd>
                <a href={`/md/${s.slug}.md`}>Markdown</a>
              </dd>
            </div>
          </dl>
        </header>
        <div className="prose" style={{ '--step': `"${s.step}"` } as React.CSSProperties}>
          <Mdx source={s.body} anchors={s.anchors} />
        </div>
        {guides.length > 0 && (
          <aside className="related-guides">
            <h2 className="related-title">Go deeper</h2>
            <ul>
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}/`}>{g.title}</Link>
                  <span>{g.dek}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <nav className="pager" aria-label="Steps">
          {prev ? (
            <Link href={`/${prev.slug}/`} className="pager-link prev">
              <span className="mono">← Step {pad(prev.step)}</span>
              <span className="pager-title">{prev.title}</span>
            </Link>
          ) : (
            <Link href="/" className="pager-link prev">
              <span className="mono">← Start</span>
              <span className="pager-title">All steps</span>
            </Link>
          )}
          {next ? (
            <Link href={`/${next.slug}/`} className="pager-link next">
              <span className="mono">Step {pad(next.step)} →</span>
              <span className="pager-title">{next.title}</span>
            </Link>
          ) : (
            <Link href="/prompts/" className="pager-link next">
              <span className="mono">Appendix →</span>
              <span className="pager-title">Every prompt in one place</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
