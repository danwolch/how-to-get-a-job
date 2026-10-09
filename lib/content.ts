import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import clipsData from '@/content/clips.json';
import { extractHeadings } from './headings.mjs';

const STEPS_DIR = path.join(process.cwd(), 'content', 'steps');
const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides');

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

/** Fields every page (step or guide) shares. */
type PageMeta = {
  slug: string;
  title: string;
  dek: string;
  /** Full <title> for search results; the H1 stays `title`. */
  seoTitle?: string;
  seoDescription?: string;
  /** Pinned section ids, keyed by heading text. See lib/headings.mjs. */
  anchors?: Record<string, string>;
  updated?: string;
  body: string;
};

export type Step = PageMeta & {
  step: number;
  short: string;
  time: string;
  optional?: boolean;
  rule: string;
};

export type Guide = PageMeta & {
  /** Slug of the step this guide goes deeper on. */
  related: string;
};

function readPages<T extends PageMeta>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      const page = { ...data, slug: f.replace(/\.mdx$/, ''), body: content } as T;
      page.title = smart(page.title);
      page.dek = smart(page.dek);
      return page;
    });
}

export const clips = clipsData as Clip[];

export function getClip(id: string): Clip {
  const clip = clips.find((c) => c.id === id);
  if (!clip) throw new Error(`Unknown clip: ${id}`);
  return clip;
}

export function getSteps(): Step[] {
  return readPages<Step>(STEPS_DIR)
    .map((s) => ({ ...s, rule: smart(s.rule) }))
    .sort((a, b) => a.step - b.step);
}

export function getGuides(): Guide[] {
  const order = getSteps().map((s) => s.slug);
  return readPages<Guide>(GUIDES_DIR).sort(
    (a, b) => order.indexOf(a.related) - order.indexOf(b.related) || a.title.localeCompare(b.title),
  );
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

export function getStep(slug: string): Step | undefined {
  return getSteps().find((s) => s.slug === slug);
}

/** h2/h3 headings of a page, with the same ids the rendered page uses. */
export function getHeadings(page: Pick<PageMeta, 'body' | 'anchors'>): { depth: 2 | 3; text: string; id: string }[] {
  return extractHeadings(page.body, page.anchors).map((h) => ({ ...h, text: smart(h.text) }));
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

export type PromptEntry = { title: string; text: string; href: string; source: string };

const PROMPT_RX = /<Prompt title="([^"]+)">\s*```[a-z]*\n([\s\S]*?)\n```\s*<\/Prompt>/g;

/** Every <Prompt> on the site: steps in order, then guides. Prompt bodies are fenced code blocks. */
export function getPrompts(): PromptEntry[] {
  const out: PromptEntry[] = [];
  for (const step of getSteps()) {
    for (const m of step.body.matchAll(PROMPT_RX)) out.push({ title: m[1], text: m[2], href: `/${step.slug}/`, source: `Step ${step.step}` });
  }
  for (const guide of getGuides()) {
    for (const m of guide.body.matchAll(PROMPT_RX)) out.push({ title: m[1], text: m[2], href: `/guides/${guide.slug}/`, source: 'Guide' });
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
