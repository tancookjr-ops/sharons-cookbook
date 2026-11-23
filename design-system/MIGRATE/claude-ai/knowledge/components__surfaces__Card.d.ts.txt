import * as React from 'react';

/**
 * The neutral surface container — cream-white, hairline border, soft
 * shadow, 12px radius. An optional coloured accent edge flags meaning
 * (primary/warn/info); `flush` removes padding for full-bleed media.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Coloured edge: top (sage, garden style), left (sage), warn (terracotta), info (sea glass). */
  accent?: 'top' | 'left' | 'warn' | 'info';
  /** Remove padding + clip contents (for images/tables). */
  flush?: boolean;
  /** Optional heading rendered as an <h2> at the top. */
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
