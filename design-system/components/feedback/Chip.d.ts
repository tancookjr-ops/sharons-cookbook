import * as React from 'react';

/**
 * A small rounded label for tags, recipe metadata (category/cuisine/meal),
 * pantry alert states and step timers. `tag` is sage; danger/warn/info map
 * to the terracotta/amber/sea-glass soft pairs.
 */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone. Default "default" (neutral sand). */
  variant?: 'default' | 'tag' | 'danger' | 'warn' | 'info';
  /** Compact variant. */
  size?: 'sm';
  className?: string;
  children?: React.ReactNode;
}

export function Chip(props: ChipProps): JSX.Element;
