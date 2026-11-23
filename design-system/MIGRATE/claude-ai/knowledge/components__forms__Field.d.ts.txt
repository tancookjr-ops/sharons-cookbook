import * as React from 'react';

/**
 * A labelled form-control wrapper. The label text sits above the control
 * (passed as children); an optional hint renders beneath.
 */
export interface FieldProps {
  /** Label text or node. */
  label: React.ReactNode;
  /** Optional dimmed helper text below the control. */
  hint?: React.ReactNode;
  /** Associates the label with a control id (optional). */
  htmlFor?: string;
  className?: string;
  /** The control (Input, Select, Textarea, …). */
  children?: React.ReactNode;
}

export function Field(props: FieldProps): JSX.Element;
