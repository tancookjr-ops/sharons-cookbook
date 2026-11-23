/**
 * Textarea — a multi-line text field. Wrapper over `textarea.input`
 * (resizes vertically only, 1.5 line-height).
 */
export function Textarea({ rows = 3, className = '', ...rest }) {
  const cls = ['input', className].filter(Boolean).join(' ');
  return <textarea rows={rows} className={cls} {...rest} />;
}
