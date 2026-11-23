/**
 * Logo — the Sharon's Cookbook brand lock-up.
 *
 * The mark is the app's own herb-leaf SVG (a sage leaf with a cream
 * midrib + veins), reproduced verbatim from index.html. `variant="full"`
 * adds the wordmark in the display serif. Colours come from the tokens, so
 * the mark adapts to light/dark automatically.
 */
export function Logo({ variant = 'full', size = 28, className = '', ...rest }) {
  const cls = ['brand', className].filter(Boolean).join(' ');
  const mark = (
    <svg
      className="brand-mark"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <path d="M12 21c-4.5 0-8-3-8-8 0-6 5-10 8-11 3 1 8 5 8 11 0 5-3.5 8-8 8Z" fill="var(--primary)" />
      <path d="M12 4v15" stroke="var(--cream)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 9c1.6-.4 3-1.6 3.6-3.2M12 13c-1.8-.4-3.4-1.8-4-3.6" stroke="var(--cream)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );

  if (variant === 'mark') {
    return <span className={cls} aria-label="Sharon's Cookbook" {...rest}>{mark}</span>;
  }
  return (
    <span className={cls} {...rest}>
      {mark}
      <span className="brand-name">Sharon's Cookbook</span>
    </span>
  );
}
