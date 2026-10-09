import { slugify } from '@/lib/content';
import { CopyLink } from './CopyLink';

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node === 'object' && 'props' in node) return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  return '';
}

export function H2({ children }: { children?: React.ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <h2 id={id} className="anchored">
      {children}
      <CopyLink id={id} />
    </h2>
  );
}

export function H3({ children }: { children?: React.ReactNode }) {
  const id = slugify(textOf(children));
  return (
    <h3 id={id} className="anchored">
      {children}
      <CopyLink id={id} />
    </h3>
  );
}
