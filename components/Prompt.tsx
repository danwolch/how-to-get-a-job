import { CopyButton } from './CopyButton';

/** A copy-paste AI prompt. Children is the prompt text (a plain string in MDX). */
export function Prompt({ title, children }: { title: string; children: React.ReactNode }) {
  const text = extractText(children).trim();
  return (
    <div className="prompt">
      <div className="prompt-bar">
        <span className="prompt-label">AI prompt</span>
        <span className="prompt-title">{title}</span>
        <CopyButton text={text} />
      </div>
      <pre className="prompt-body">{text}</pre>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props: { children?: React.ReactNode } }).props;
    return extractText(props.children);
  }
  return '';
}
