// Section ids, shared by the site and the build scripts so they always agree.
// A heading's id is its slug, unless the page's `anchors` frontmatter pins it:
//   anchors:
//     "New heading text": "old-id"
// Pin an id whenever you reword a heading, so links people already shared keep working.
// scripts/check-anchors.mjs fails the build if a previously published id disappears.

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Plain heading text from a markdown heading line (drops emphasis, code and link syntax). */
export function plainHeading(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}

export function headingId(text, anchors) {
  const plain = plainHeading(text);
  return (anchors && anchors[plain]) || slugify(plain);
}

/** h2/h3 headings in an MDX body, skipping fenced code. */
export function extractHeadings(body, anchors) {
  const out = [];
  let fenced = false;
  for (const line of body.split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    if (fenced) continue;
    const m = /^(##|###) (.+)$/.exec(line);
    if (m) out.push({ depth: m[1].length, text: plainHeading(m[2]), id: headingId(m[2], anchors) });
  }
  return out;
}
