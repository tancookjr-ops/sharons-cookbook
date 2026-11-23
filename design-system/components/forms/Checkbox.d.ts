import * as React from 'react';

/**
 * A checkbox with an inline label; the tick is sage (accent-color:
 * var(--primary)). Also the base for shopping-list rows.
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Inline label text. */
  label: React.ReactNode;
  /** Compact variant. */
  size?: 'sm';
  className?: string;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
