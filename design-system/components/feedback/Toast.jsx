/**
 * Toast — a transient confirmation message.
 *
 * Wrapper over `.toast` (ink surface, cream text) with a coloured left
 * border by tone. In the app these appear bottom-centre and auto-dismiss;
 * this component renders a single toast for composition/preview.
 */
export function Toast({ tone = 'success', className = '', children, ...rest }) {
  const toneClass = { success: 'toast-success', warn: 'toast-warn', error: 'toast-error' }[tone] || 'toast-success';
  const cls = ['toast', toneClass, className].filter(Boolean).join(' ');
  return <div className={cls} role="status" {...rest}>{children}</div>;
}
