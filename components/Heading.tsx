import { CopyLink } from './CopyLink';

type Props = { id?: string; children?: React.ReactNode };

export function H2({ id, children }: Props) {
  return (
    <h2 id={id} className="anchored">
      {children}
      {id && <CopyLink id={id} />}
    </h2>
  );
}

export function H3({ id, children }: Props) {
  return (
    <h3 id={id} className="anchored">
      {children}
      {id && <CopyLink id={id} />}
    </h3>
  );
}
