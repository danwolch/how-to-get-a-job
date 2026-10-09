import Link from 'next/link';
import type { Step } from '@/lib/content';
import { pad } from '@/lib/content';
import { RailSpy } from './RailSpy';

type Props = { steps: Step[]; current: string; headings: { depth: 2 | 3; text: string; id: string }[] };

export function StepRail({ steps, current, headings }: Props) {
  const sections = headings.filter((h) => h.depth === 2);
  return (
    <aside className="rail">
      <RailSpy />
      <details className="rail-details" open>
        <summary className="rail-summary">Contents</summary>
        <ol className="rail-steps">
          {steps.map((s) => (
            <li key={s.slug} className={s.slug === current ? 'is-current' : undefined}>
              <Link href={`/${s.slug}/`} aria-current={s.slug === current ? 'page' : undefined}>
                <span className="mono">{pad(s.step)}</span>
                <span>{s.short}</span>
              </Link>
              {s.slug === current && sections.length > 0 && (
                <ul className="rail-sections">
                  {sections.map((h, n) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>
                        <span className="mono">
                          {s.step}.{n + 1}
                        </span>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </details>
    </aside>
  );
}
