import type { Metadata } from 'next';
import Link from 'next/link';
import { getSteps, getGuides, clips, pad } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, homeJsonLd } from '@/components/JsonLd';
import { CopyButton } from '@/components/CopyButton';
import { site } from '@/lib/site.mjs';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'How to Get a Job: A Free, Step-by-Step Job Search Course',
  description: site.description,
  type: 'website',
});

export default function Home() {
  const steps = getSteps();
  const guides = getGuides();
  const speakers = [...new Set(clips.map((c) => c.speaker))];

  return (
    <div className="home">
      <JsonLd data={homeJsonLd(steps)} />
      <section className="wrap hero">
        <h1 className="hero-title">
          How to get <br />a job.
        </h1>
        <div className="hero-lede">
          <p>
            Most job search advice is either a listicle or the top of a sales funnel. This is the process I’d
            hand a friend who just lost their job: what to do, in what order, and what to say, with clips from the
            recruiters, executives and authors who’ve watched thousands of searches from the hiring side.
          </p>
          <p className="hero-for">
            Written for people who work at desks: tech, product, design, engineering, marketing, operations, finance.
          </p>
        </div>
        <div className="hero-actions">
          <Link href={`/${steps[0].slug}/`} className="btn">
            Start at step one
          </Link>
          <Link href={`/${steps[1].slug}/`} className="btn-quiet">
            Not laid off? Skip to step two →
          </Link>
        </div>
      </section>

      <section className="wrap steps-index" id="steps" aria-labelledby="steps-h">
        <h2 id="steps-h" className="section-title">
          The steps
        </h2>
        <ol className="step-list">
          {steps.map((s) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}/`} className="step-row">
                <span className="step-num mono">{pad(s.step)}</span>
                <span className="step-main">
                  <span className="step-title">
                    {s.title}
                    {s.optional && <span className="pill">Optional</span>}
                  </span>
                  <span className="step-dek">{s.dek}</span>
                </span>
                <span className="step-time mono">{s.time}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap split" aria-labelledby="guides-h">
        <h2 id="guides-h" className="section-title">
          Guides and templates
        </h2>
        <ul className="guide-links">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}/`}>{g.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap split" aria-labelledby="short-h">
        <h2 id="short-h" className="section-title">
          The short version
        </h2>
        <ol className="rules">
          {steps.map((s) => (
            <li key={s.slug}>
              <span className="mono">{pad(s.step)}</span>
              <p>{s.rule}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap split" aria-labelledby="use-h">
        <h2 id="use-h" className="section-title">
          How to use it
        </h2>
        <div className="use-grid">
          <div>
            <h3>Do it in order</h3>
            <p>
              Each step makes the next one easier. The most common mistake is jumping straight to networking or
              applications before you can say, in a sentence, what you’re for.
            </p>
          </div>
          <div>
            <h3>Watch the clips</h3>
            <p>
              Every clip is queued to the moment that matters, usually under two minutes. They come from long-form
              podcasts, so keep watching if one grabs you.
            </p>
          </div>
          <div>
            <h3>Link the parts you need</h3>
            <p>
              Every section has a permanent link. Hover a heading and click <span className="mono">#</span> to copy
              it, then paste it into a Reddit reply, a Slack DM or a note to a friend.
            </p>
          </div>
          <div>
            <h3>Give it to your AI</h3>
            <p>The whole course is one Markdown file. Paste the link into ChatGPT or Claude and ask it to coach you through your own search.</p>
            <div className="inline-copy">
              <code>{site.url}/course.md</code>
              <CopyButton text={`${site.url}/course.md`} />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap split" aria-labelledby="voices-h">
        <h2 id="voices-h" className="section-title">
          Who you’ll hear from
        </h2>
        <p className="voices">
          {speakers.map((name, i) => (
            <span key={name}>
              {name}
              {i < speakers.length - 1 ? <span className="dot"> · </span> : null}
            </span>
          ))}
        </p>
        <p className="voices-more">
          <Link href="/clips/">Browse every clip →</Link>
        </p>
      </section>
    </div>
  );
}
