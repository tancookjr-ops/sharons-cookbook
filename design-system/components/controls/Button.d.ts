import * as React from 'react';

/**
 * The primary action control — a pill button in brand variants and sizes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Default "primary". */
  variant?: 'primary' | 'ghost' | 'danger' | 'danger-ghost';
  /** Size. Default "md". */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a link to this href instead of a <button>. */
  href?: string;
  /** Optional leading glyph/icon (e.g. "＋", "★"). */
  icon?: React.ReactNode;
  /** Disabled state (ignored when rendering as a link). */
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
