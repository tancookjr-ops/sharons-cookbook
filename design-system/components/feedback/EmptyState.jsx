/**
 * EmptyState — a centred, dashed-border panel for "nothing here yet".
 *
 * Wrapper over `.empty-state`. Pass a message via children and an optional
 * call-to-action Button as `action`.
 */
export function EmptyState({ className = '', action, children, ...rest }) {
  const cls = ['empty-state', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <p>{children}</p>
      {action}
    </div>
  );
}
