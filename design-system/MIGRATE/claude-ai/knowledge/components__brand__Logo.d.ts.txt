import * as React from 'react';

/**
 * The Sharon's Cookbook brand lock-up: the herb-leaf mark (sage leaf with
 * a cream midrib) alone, or with the "Sharon's Cookbook" wordmark in the
 * display serif. The mark's colours are token-driven, so it adapts to the
 * active theme. The mark ships as PNG app icons under assets/brand/ too.
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** "full" = mark + wordmark; "mark" = leaf only. Default "full". */
  variant?: 'full' | 'mark';
  /** Mark size in px. Default 28. */
  size?: number;
  className?: string;
}

export function Logo(props: LogoProps): JSX.Element;
