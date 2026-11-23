import * as React from 'react';

/**
 * A single-line text field with the brand's hairline border and sage focus
 * ring. Accepts every native <input> attribute (type, value, placeholder…).
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Compact variant. Default "md". */
  size?: 'sm' | 'md';
  className?: string;
}

export function Input(props: InputProps): JSX.Element;
