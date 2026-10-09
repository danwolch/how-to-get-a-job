// Keeps section links permanent. content/anchors.lock.json records every section id
// the site has published. If a heading is reworded and its id would change, the build
// fails until the old id is pinned with `anchors:` in that page's frontmatter.
// New ids are added to the lock file automatically; commit the change.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { extractHeadings } from '../lib/headings.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const lockPath = path.join(root, 'content/anchors.lock.json');
const lock = fs.existsSync(lockPath) ? JSON.parse(fs.readFileSync(lockPath, 'utf8')) : {};

const pages = [
  ['steps', (slug) => `/${slug}/`],
  ['guides', (slug) => `/guides/${slug}/`],
];

const current = {};
for (const [dir, url] of pages) {
  const full = path.join(root, 'content', dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full).filter((f) => f.endsWith('.mdx'))) {
    const { data, content } = matter(fs.readFileSync(path.join(full, f), 'utf8'));
    current[url(f.replace(/\.mdx$/, ''))] = extractHeadings(content, data.anchors).map((h) => h.id);
  }
}

const missing = [];
for (const [page, ids] of Object.entries(lock)) {
  for (const id of ids) if (!current[page]?.includes(id)) missing.push(`${page}#${id}`);
}
if (missing.length) {
  console.error(
    `\nThese published section links would break:\n  ${missing.join('\n  ')}\n\n` +
      `Pin each old id to its reworded heading in the page's frontmatter, e.g.\n` +
      `anchors:\n  "New heading text": "old-id"\n`,
  );
  process.exit(1);
}

const merged = {};
for (const page of [...new Set([...Object.keys(lock), ...Object.keys(current)])].sort()) {
  merged[page] = [...new Set([...(lock[page] ?? []), ...(current[page] ?? [])])];
}
fs.writeFileSync(lockPath, JSON.stringify(merged, null, 2) + '\n');
console.log(`anchors: ${Object.values(merged).flat().length} section links locked`);
