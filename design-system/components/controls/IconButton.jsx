/**
 * IconButton — a borderless, circular button for a single glyph or SVG.
 *
 * Used for topbar affordances (menu, theme), row actions and the ± steppers
 * on the recipe scaler. Wrapper over `.icon-btn` in components.css. Always
 * pass an accessible `aria-label` since the content is icon-only.
 */
export function IconButton({ label, className = '', children, ...rest }) {
  const cls = ['icon-btn', className].filter(Boolean).join(' ');
  return (
    <button className={cls} aria-label={label} title={rest.title || label} {...rest}>
      {children}
    </button>
  );
}
