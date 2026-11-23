/**
 * Field — a labelled form control wrapper.
 *
 * Mirrors the app's `<label>Text <input class="input"></label>` pattern:
 * the label sits above and the control is passed as children. Optional
 * `hint` renders dimmed helper text beneath.
 */
export function Field({ label, hint, htmlFor, className = '', children }) {
  const cls = ['field', className].filter(Boolean).join(' ');
  return (
    <label className={cls} htmlFor={htmlFor}>
      {label}
      {children}
      {hint ? <small className="hint">{hint}</small> : null}
    </label>
  );
}
