import type { Metadata } from 'next';
import { site } from '@/lib/site.mjs';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/about/',
  title: 'About · How to Get a Job',
  description: 'Why this free, open-source job search course exists, who writes it, and how to contribute.',
  type: 'website',
});

export default function AboutPage() {
  return (
    <div className="wrap narrow page prose">
      <h1 className="page-title">Why this exists</h1>
      <p>
        I spend a lot of time answering the same job search questions in Reddit threads and DMs, usually by retyping
        the same advice. This is that advice written down once, in order, with permanent links to every section so I
        can point people at the exact part they need.
      </p>
      <p>
        It’s opinionated. Where something is my coaching judgment rather than research, it says so. Where the
        best answer comes from someone who has hired or coached thousands of people, you hear it from them directly,
        in a clip queued to the moment they say it.
      </p>
      <h2>Who it’s for</h2>
      <p>
        Information workers: people in tech, product, design, engineering, marketing, operations, finance and similar
        jobs.
      </p>
      <h2>Open source</h2>
      <p>
        The text is licensed <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. The source is on{' '}
        <a href={site.repo}>GitHub</a>. Corrections, better clips and disagreements are welcome as issues or pull
        requests. The clips belong to their creators. They’re embedded from YouTube and every one links to the
        full episode, so if one helps you, go subscribe.
      </p>
      <h2>Tools</h2>
      <p>
        You can do everything here with a notebook, a spreadsheet and any AI chatbot, and every prompt in the course
        is free to use. I also build <a href="https://work.coach">Work Coach</a>, which handles some of the practice
        parts, like reviewing recorded calls and running mock interviews with feedback. It’s mentioned where
        it’s relevant, as one option among several. You don’t need it.
      </p>
      <p className="muted">Maintained by {site.author}.</p>
    </div>
  );
}
