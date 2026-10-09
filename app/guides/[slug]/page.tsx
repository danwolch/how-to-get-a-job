import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/Mdx';
import { JsonLd, guideJsonLd } from '@/components/JsonLd';
import { getGuides, getGuide, getSteps, getHeadings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return pageMetadata({ path: `/guides/${g.slug}/`, title: g.seoTitle ?? `${g.title} · How to Get a Job`, description: g.seoDescription ?? g.dek });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const step = getSteps().find((s) => s.slug === g.related);
  const sections = getHeadings(g).filter((h) => h.depth === 2);
  const others = getGuides().filter((o) => o.slug !== g.slug);

  return (
    <div className="wrap step-layout">
      <JsonLd data={guideJsonLd(g)} />
      <aside className="rail">
        <details className="rail-details" open>
          <summary className="rail-summary">On this page</summary>
          <ol className="rail-steps rail-guide">
            {sections.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ol>
        </details>
      </aside>
      <article className="step">
        <header className="step-head">
          <h1>{g.title}</h1>
          <p className="dek">{g.dek}</p>
          <dl className="step-meta">
            {step && (
              <div>
                <dt>Part of</dt>
                <dd>
                  <Link href={`/${step.slug}/`}>
                    Step {step.step}: {step.short}
                  </Link>
                </dd>
              </div>
            )}
            {g.updated && (
              <div>
                <dt>Updated</dt>
                <dd>
                  <time dateTime={g.updated}>
                    {new Date(`${g.updated}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        </header>
        <div className="prose prose-guide">
          <Mdx source={g.body} anchors={g.anchors} />
        </div>
        <aside className="related-guides">
          <h2 className="related-title">More guides</h2>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/guides/${o.slug}/`}>{o.title}</Link>
                <span>{o.dek}</span>
              </li>
            ))}
          </ul>
        </aside>
        <nav className="pager" aria-label="Course">
          <Link href="/guides/" className="pager-link prev">
            <span className="mono">← All guides</span>
            <span className="pager-title">Guides and templates</span>
          </Link>
          {step && (
            <Link href={`/${step.slug}/`} className="pager-link next">
              <span className="mono">Step {step.step} →</span>
              <span className="pager-title">{step.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
