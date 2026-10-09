import type { Metadata } from 'next';
import Link from 'next/link';
import { getPrompts, pad } from '@/lib/content';
import { CopyButton } from '@/components/CopyButton';

export const metadata: Metadata = {
  title: 'Every prompt',
  description: 'Every copy-paste AI prompt in the course, in one place.',
};

export default function PromptsPage() {
  const prompts = getPrompts();
  return (
    <div className="wrap narrow page">
      <h1 className="page-title">Every prompt</h1>
      <p className="dek">
        The copy-paste prompts from each step, collected. They work in ChatGPT, Claude, Gemini or anything else. Fill
        in the brackets, and paste your resume or notes where it asks. You’ll get more out of them after reading
        the step they come from.
      </p>
      <div className="prompt-index">
        {prompts.map((p) => (
          <section key={p.title} className="prompt">
            <div className="prompt-bar">
              <span className="prompt-label">
                <Link href={`/${p.step.slug}/`}>Step {pad(p.step.step)}</Link>
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
