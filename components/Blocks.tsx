/** A message, email or script the reader can adapt. */
export function Example({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="example">
      {label && <div className="example-label">{label}</div>}
      <div className="example-body">{children}</div>
    </div>
  );
}

/** A short aside: a caveat, an honest admission, or a pointer. */
export function Note({ children }: { children: React.ReactNode }) {
  return <aside className="note">{children}</aside>;
}

/** The end-of-step checklist. */
export function Checklist({ children }: { children: React.ReactNode }) {
  return (
    <section className="checklist" aria-label="Before you move on">
      <div className="checklist-label">Before you move on</div>
      {children}
    </section>
  );
}
