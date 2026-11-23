/**
 * Card — the neutral surface container used across the app.
 *
 * Cream-white surface, hairline border, soft card shadow, 12px radius.
 * `accent` adds a coloured edge (the app uses these to flag today's meals,
 * warnings, health panels and garden cards). `flush` removes padding for
 * media/tables that should bleed to the edge.
 */
export function Card({ accent, flush = false, title, className = '', children, ...rest }) {
  const accentClass = {
    top: 'card-accent-top',
    left: 'card-accent-left',
    warn: 'card-accent-warn',
    info: 'card-accent-info',
  }[accent] || '';
  const cls = ['card', accentClass, flush ? 'card-flush' : '', className].filter(Boolean).join(' ');
  return (
    <section className={cls} {...rest}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
