// Groups each h2 and the content after it into <section class="sheet">, so every
// section of a step renders as its own block. Content before the first h2 becomes
// an unnumbered intro sheet; the closing <Checklist> stays outside the sheets.

type Node = { type: string; tagName?: string; name?: string; value?: string; children?: Node[]; properties?: Record<string, unknown> };

export default function rehypeSections() {
  return (tree: Node) => {
    const out: Node[] = [];
    let current: Node | null = null;
    const open = (numbered: boolean) => {
      current = {
        type: 'element',
        tagName: 'section',
        properties: { className: numbered ? ['sheet', 'sheet-numbered'] : ['sheet', 'sheet-intro'] },
        children: [],
      };
      out.push(current);
      return current;
    };
    for (const node of tree.children ?? []) {
      if (node.type === 'mdxJsxFlowElement' && node.name === 'Checklist') {
        out.push(node);
        current = null;
        continue;
      }
      const isH2 = node.type === 'element' && node.tagName === 'h2';
      if (!isH2 && !current && node.type === 'text' && !node.value?.trim()) continue;
      const target: Node = isH2 || !current ? open(isH2) : current;
      target.children!.push(node);
    }
    tree.children = out;
  };
}
