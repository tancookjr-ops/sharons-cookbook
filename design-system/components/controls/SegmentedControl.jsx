/**
 * SegmentedControl — a pill-shaped set of mutually-exclusive options.
 *
 * The app uses it for planner day/week/month, pantry locations and garden
 * tabs. Wrapper over `.seg` / `.seg-btn` in components.css. Each option is
 * `{ value, label, hint? }`; the active option gets a raised white pill.
 */
export function SegmentedControl({ options = [], value, onChange, className = '', ...rest }) {
  const cls = ['seg', className].filter(Boolean).join(' ');
  return (
    <div className={cls} role="tablist" {...rest}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={active ? 'seg-btn active' : 'seg-btn'}
            onClick={() => onChange && onChange(opt.value)}
          >
            {opt.label}
            {opt.hint ? <small> {opt.hint}</small> : null}
          </button>
        );
      })}
    </div>
  );
}
