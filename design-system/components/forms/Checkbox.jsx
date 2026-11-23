/**
 * Checkbox — a checkbox with an inline label (`.check-label`).
 *
 * The tick uses `accent-color: var(--primary)` (sage). Pass `size="sm"`
 * for the compact variant used in the ingredient editor.
 */
export function Checkbox({ label, size, className = '', ...rest }) {
  const cls = ['check-label', size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return (
    <label className={cls}>
      <input type="checkbox" {...rest} />
      {label}
    </label>
  );
}
