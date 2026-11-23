import * as React from 'react';

/**
 * A borderless circular button for a single icon or glyph.
 * Requires an accessible label because it has no visible text.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name (used for aria-label and title). Required. */
  label: string;
  className?: string;
  /** The glyph, unicode character, or SVG to render. */
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
