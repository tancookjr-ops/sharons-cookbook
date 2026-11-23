import * as React from 'react';

export type SelectOption = string | { value: string; label: React.ReactNode };

/**
 * A native <select> styled to match Input. Provide `options` (strings or
 * {value,label}) or your own <option> children.
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Select(props: SelectProps): JSX.Element;
