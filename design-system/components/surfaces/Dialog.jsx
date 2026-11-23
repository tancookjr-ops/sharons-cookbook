/**
 * Dialog — the shared modal surface.
 *
 * Renders the `.app-dialog` panel (title, body, action row). By default it
 * renders the panel inline for composition/preview; pass `open` to mount a
 * real <dialog> with a backdrop. `wide` uses the 42rem width.
 */
export function Dialog({ title, actions, open, wide = false, onClose, className = '', children, ...rest }) {
  const cls = ['app-dialog', wide ? 'dialog-wide' : '', className].filter(Boolean).join(' ');
  const body = (
    <div className="dialog-body">
      {title ? <h2 className="dialog-title">{title}</h2> : null}
      <div className="dialog-message">{children}</div>
      {actions ? <div className="dialog-actions">{actions}</div> : null}
    </div>
  );

  if (open) {
    return (
      <dialog className={cls} open onClose={onClose} {...rest}>
        {body}
      </dialog>
    );
  }
  // Inline preview: render the panel as a positioned surface.
  return (
    <div className={cls} role="dialog" aria-modal="false" style={{ position: 'static', margin: 0 }} {...rest}>
      {body}
    </div>
  );
}
