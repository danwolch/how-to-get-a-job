// Renders the course as plain Markdown (public/course.md, public/md/<step>.md, public/llms.txt)
// so people can read it on GitHub or hand the whole thing to an AI assistant.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { site } from '../lib/site.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const clips = JSON.parse(fs.readFileSync(path.join(root, 'content/clips.json'), 'utf8'));
const stepsDir = path.join(root, 'content/steps');

const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

function toMarkdown(body) {
  return body
    .replace(/<Clip id="([^"]+)"\s*\/>/g, (_, id) => {
      const c = clips.find((x) => x.id === id);
      if (!c) throw new Error(`Unknown clip ${id}`);
      return `> "${c.quote}"\n>\n> — ${c.speaker}, ${c.descriptor}. ${c.podcast}, "${c.episode}" at [${fmt(c.start)}](https://www.youtube.com/watch?v=${c.youtubeId}&t=${c.start}s)`;
    })
    .replace(/<Prompt title="([^"]+)">\s*/g, (_, t) => `**AI prompt: ${t}**\n\n`)
    .replace(/\s*<\/Prompt>/g, '')
    .replace(/<Example(?: label="([^"]+)")?>\s*/g, (_, l) => (l ? `**${l}**\n\n` : ''))
    .replace(/\s*<\/Example>/g, '')
    .replace(/<Note>\s*/g, '')
    .replace(/\s*<\/Note>/g, '')
    .replace(/<Checklist>\s*/g, '**Before you move on**\n\n')
    .replace(/\s*<\/Checklist>/g, '')
    .replace(/\]\((\/[a-z0-9/-]*)(#[^)]+)?\)/g, (_, p, hash = '') => `](${site.url}${p}${hash})`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const readDir = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => ({ slug: f.replace(/\.mdx$/, ''), ...matter(fs.readFileSync(path.join(dir, f), 'utf8')) }))
    : [];
const guides = readDir(path.join(root, 'content/guides'));

const steps = fs
  .readdirSync(stepsDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => ({ slug: f.replace(/\.mdx$/, ''), ...matter(fs.readFileSync(path.join(stepsDir, f), 'utf8')) }))
  .sort((a, b) => a.data.step - b.data.step);

fs.mkdirSync(path.join(root, 'public/md'), { recursive: true });

const parts = [
  `# ${site.name}\n\nA free, open-source course on getting a white-collar job. Web version: ${site.url}\n\nLicense: CC BY 4.0. Quotes belong to their speakers; each links to the moment in the original video.\n\n## Steps\n\n` +
    steps.map((s) => `${s.data.step}. **${s.data.title}**: ${s.data.rule}`).join('\n'),
];

for (const s of steps) {
  const md = `# Step ${s.data.step}: ${s.data.title}\n\n_${s.data.dek}_\n\nTime: ${s.data.time}. Web: ${site.url}/${s.slug}/\n\n${toMarkdown(s.content)}\n`;
  fs.writeFileSync(path.join(root, 'public/md', `${s.slug}.md`), md);
  parts.push(md.replace(/^# /, '## ').replace(/\n(#{2,5}) /g, '\n#$1 '));
}

for (const g of guides) {
  const md = `# ${g.data.title}\n\n_${g.data.dek}_\n\nWeb: ${site.url}/guides/${g.slug}/\n\n${toMarkdown(g.content)}\n`;
  fs.writeFileSync(path.join(root, 'public/md', `guide-${g.slug}.md`), md);
  parts.push(md.replace(/^# /, '## Guide: ').replace(/\n(#{2,5}) /g, '\n#$1 '));
}

fs.writeFileSync(path.join(root, 'public/course.md'), parts.join('\n\n---\n\n') + '\n');
fs.writeFileSync(
  path.join(root, 'public/llms.txt'),
  `# ${site.name}\n\n> A free, open-source course on getting a white-collar job, in ${steps.length} steps.\n\n- [Whole course as one Markdown file](${site.url}/course.md)\n` +
    steps.map((s) => `- [Step ${s.data.step}: ${s.data.title}](${site.url}/md/${s.slug}.md): ${s.data.dek}`).join('\n') +
    (guides.length ? '\n\n## Guides\n\n' + guides.map((g) => `- [${g.data.title}](${site.url}/md/guide-${g.slug}.md): ${g.data.dek}`).join('\n') : '') +
    '\n'
);
console.log(`markdown: ${steps.length} steps, ${guides.length} guides -> public/course.md`);
