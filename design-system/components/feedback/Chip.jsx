/**
 * Chip — a small rounded label for tags, categories and metadata.
 *
 * Wrapper over `.chip` in components.css. `variant` picks the tone;
 * `size="sm"` is the compact `.chip-sm`.
 */
export function Chip({ variant = 'default', size, className = '', children, ...rest }) {
  const variantClass = {
    default: '',
    tag: 'chip-tag',
    danger: 'chip-danger',
    warn: 'chip-warn',
    info: 'chip-info',
  }[variant] || '';
  const cls = ['chip', variantClass, size === 'sm' ? 'chip-sm' : '', className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}
