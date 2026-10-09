import { headingId } from './headings.mjs';

type MdNode = { type: string; depth?: number; value?: string; children?: MdNode[]; data?: { hProperties?: Record<string, unknown> } };

function text(node: MdNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  return (node.children ?? []).map(text).join('');
}

/** Gives every h2/h3 a stable id (see lib/headings.mjs). */
export default function remarkHeadingIds(options: { anchors?: Record<string, string> } = {}) {
  return (tree: MdNode) => {
    const visit = (node: MdNode) => {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        node.data = node.data ?? {};
        node.data.hProperties = { ...(node.data.hProperties ?? {}), id: headingId(text(node), options.anchors) };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
