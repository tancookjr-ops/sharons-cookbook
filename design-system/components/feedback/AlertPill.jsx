/**
 * AlertPill — a pill-shaped status badge for inline alert strips.
 *
 * Used on the pantry/dashboard alert rows. Wrapper over `.alert-pill`
 * with a tone class. Group several inside an `.alert-strip` flex row.
 */
export function AlertPill({ tone = 'info', className = '', children, ...rest }) {
  const toneClass = { danger: 'alert-danger', warn: 'alert-warn', info: 'alert-info' }[tone] || 'alert-info';
  const cls = ['alert-pill', toneClass, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
