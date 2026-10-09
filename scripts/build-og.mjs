// Renders share images to public/og/*.png (and the apple touch icon) at build time.
// Static .png files get the right content type and no trailing-slash redirect,
// which social crawlers need.
import fs from 'node:fs';
import path from 'node:path';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'public/og');
fs.mkdirSync(outDir, { recursive: true });

const fonts = [
  { name: 'Schibsted', data: fs.readFileSync(path.join(root, 'assets/fonts/SchibstedGrotesk-Bold.ttf')), weight: 700 },
  { name: 'Mono', data: fs.readFileSync(path.join(root, 'assets/fonts/JetBrainsMono-Regular.ttf')), weight: 400 },
];

function card(title, footer) {
  const size = title.length > 60 ? 64 : title.length > 36 ? 76 : 96;
  return h('div', { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f4f4f1', color: '#131313', padding: '64px 72px', fontFamily: 'Schibsted' } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 30 } }, h('div', { style: { width: 22, height: 22, background: '#e0461f' } }), 'How to Get a Job'),
    h('div', { style: { display: 'flex', fontSize: size, lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 1000 } }, title),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #131313', paddingTop: 22, fontFamily: 'Mono', fontSize: 24, color: '#3b3c3e' } },
      h('span', null, footer), h('span', { style: { color: '#b8360f' } }, 'howtogetajob.tech')));
}

async function write(file, element, opts) {
  const res = new ImageResponse(element, opts);
  fs.writeFileSync(path.join(root, 'public', file), Buffer.from(await res.arrayBuffer()));
}

const read = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => ({ slug: f.replace(/\.mdx$/, ''), ...matter(fs.readFileSync(path.join(dir, f), 'utf8')).data })) : [];
const steps = read(path.join(root, 'content/steps')).sort((a, b) => a.step - b.step);
const guides = read(path.join(root, 'content/guides'));
const og = { width: 1200, height: 630, fonts };

await write('og/home.png', card('A free, step-by-step job search course.', '7 steps · templates · expert clips'), og);
for (const s of steps) await write(`og/${s.slug}.png`, card(s.title, `Step ${s.step} of ${steps.length}`), og);
for (const g of guides) await write(`og/guide-${g.slug}.png`, card(g.title, 'Guide · free templates'), og);
await write('apple-touch-icon.png', h('div', { style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#131313' } }, h('div', { style: { width: 80, height: 80, background: '#e0461f' } })), { width: 180, height: 180 });
console.log(`og: ${1 + steps.length + guides.length} share images`);
