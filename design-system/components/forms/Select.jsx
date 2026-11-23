/**
 * Select — a native dropdown styled as `.input`.
 *
 * `options` may be strings or `{ value, label }` objects. Pass `children`
 * instead to supply your own <option>/<optgroup> markup.
 */
export function Select({ options, value, onChange, className = '', children, ...rest }) {
  const cls = ['input', className].filter(Boolean).join(' ');
  return (
    <select className={cls} value={value} onChange={onChange} {...rest}>
      {children}
      {(options || []).map((o) => {
        const val = typeof o === 'object' ? o.value : o;
        const label = typeof o === 'object' ? o.label : o;
        return <option key={val} value={val}>{label}</option>;
      })}
    </select>
  );
}
