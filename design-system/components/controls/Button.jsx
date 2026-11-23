/**
 * Button — the primary action control.
 *
 * A pill-shaped button (border-radius: 999px) in four brand variants and
 * three sizes. Renders an <a> when `href` is set, otherwise a <button>.
 * Thin wrapper over the `.btn` classes in components.css.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const variantClass = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    'danger-ghost': 'btn-danger-ghost',
  }[variant] || 'btn-primary';

  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  const cls = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');

  const inner = (
    <>
      {icon ? <span className="btn-icon" aria-hidden="true">{icon}</span> : null}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <a className={cls} href={href} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}
