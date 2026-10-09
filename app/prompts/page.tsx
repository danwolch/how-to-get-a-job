import type { Metadata } from 'next';
import Link from 'next/link';
import { getPrompts } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { CopyButton } from '@/components/CopyButton';

export const metadata: Metadata = pageMetadata({
  path: '/prompts/',
  title: 'ChatGPT and Claude Prompts for Your Job Search (Free)',
  description:
    'Free copy-paste AI prompts for every step of a job search: resume review, tailoring to a job description, intro emails, mock interviews and negotiation.',
  type: 'website',
});

export default function PromptsPage() {
  const prompts = getPrompts();
  return (
    <div className="wrap narrow page">
      <h1 className="page-title">Every prompt</h1>
      <p className="dek">
        Copy-paste ChatGPT and Claude prompts for every part of a job search, collected from the course. They work in
        ChatGPT, Claude, Gemini or anything else. Fill in the brackets, and paste your resume or notes where it asks.
        You’ll get more out of them after reading the step they come from.
      </p>
      <div className="prompt-index">
        {prompts.map((p) => (
          <section key={p.title} className="prompt">
            <div className="prompt-bar">
              <span className="prompt-label">
                <Link href={p.href}>{p.source}</Link>
              </span>
              <span className="prompt-title">{p.title}</span>
              <CopyButton text={p.text} />
            </div>
            <pre className="prompt-body">{p.text}</pre>
          </section>
        ))}
      </div>
    </div>
  );
}
