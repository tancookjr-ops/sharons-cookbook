import * as React from 'react';

/**
 * The shared modal surface: title, message body, and a right-aligned action
 * row. The app uses it for confirmations ("Delete this recipe?") and small
 * forms ("Plan this recipe"). Pass `open` for a real <dialog> + backdrop.
 */
export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
  /** Heading. */
  title?: React.ReactNode;
  /** Right-aligned action row, typically two <Button>s. */
  actions?: React.ReactNode;
  /** Mount as a real modal <dialog open> with a blurred backdrop. */
  open?: boolean;
  /** Wider 42rem variant (for forms). */
  wide?: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): JSX.Element;
