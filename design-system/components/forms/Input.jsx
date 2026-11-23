/**
 * Input — a single-line text field.
 *
 * Wrapper over `.input` in components.css: cream-white surface, hairline
 * border, sage focus ring. Pass `size="sm"` for the compact `.input-sm`.
 */
export function Input({ size = 'md', type = 'text', className = '', ...rest }) {
  const cls = ['input', size === 'sm' ? 'input-sm' : '', className].filter(Boolean).join(' ');
  return <input type={type} className={cls} {...rest} />;
}
