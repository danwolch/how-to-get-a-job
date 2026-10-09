import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import clipsData from '@/content/clips.json';

const STEPS_DIR = path.join(process.cwd(), 'content', 'steps');

export type Clip = {
  id: string;
  youtubeId: string;
  start: number;
  quote: string;
  speaker: string;
  descriptor: string;
  podcast: string;
  episode: string;
  date: string;
};

export type StepMeta = {
  slug: string;
  step: number;
  title: string;
  short: string;
  dek: string;
  time: string;
  optional?: boolean;
  rule: string;
};

export type Step = StepMeta & { body: string };

export const clips = clipsData as Clip[];

export function getClip(id: string): Clip {
  const clip = clips.find((c) => c.id === id);
  if (!clip) throw new Error(`Unknown clip: ${id}`);
  return clip;
}

export function getSteps(): Step[] {
  return fs
    .readdirSync(STEPS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(STEPS_DIR, f), 'utf8'));
      const meta = data as Omit<StepMeta, 'slug'>;
      return { ...meta, title: smart(meta.title), dek: smart(meta.dek), rule: smart(meta.rule), slug: f.replace(/\.mdx$/, ''), body: content };
    })
    .sort((a, b) => a.step - b.step);
}

export function getStep(slug: string): Step | undefined {
  return getSteps().find((s) => s.slug === slug);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** h2/h3 headings in an MDX body, for the on-this-page rail. Matches rehype-slug's ids for plain-text headings. */
export function getHeadings(body: string): { depth: 2 | 3; text: string; id: string }[] {
  const out: { depth: 2 | 3; text: string; id: string }[] = [];
  let fenced = false;
  for (const line of body.split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    if (fenced) continue;
    const m = /^(##|###) (.+)$/.exec(line);
    if (m) out.push({ depth: m[1].length as 2 | 3, text: smart(m[2].trim()), id: slugify(m[2].trim()) });
  }
  return out;
}

/** Clip ids referenced by a step, in order. */
export function clipIdsIn(body: string): string[] {
  return [...body.matchAll(/<Clip id="([^"]+)"/g)].map((m) => m[1]);
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export type PromptEntry = { title: string; text: string; step: Step };

/** Every <Prompt> in the course, in step order. Prompt bodies are fenced code blocks. */
export function getPrompts(): PromptEntry[] {
  const out: PromptEntry[] = [];
  for (const step of getSteps()) {
    for (const m of step.body.matchAll(/<Prompt title="([^"]+)">\s*```[a-z]*\n([\s\S]*?)\n```\s*<\/Prompt>/g)) {
      out.push({ title: m[1], text: m[2], step });
    }
  }
  return out;
}

/** Typographic quotes and apostrophes for strings rendered outside MDX. */
export function smart(text: string): string {
  return text
    .replace(/(^|[\s(\[—-])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s(\[—-])'/g, '$1‘')
    .replace(/'/g, '’');
}
