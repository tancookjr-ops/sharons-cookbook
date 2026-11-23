import * as React from 'react';

/**
 * A multi-line text field that resizes vertically only. Used for recipe
 * descriptions, notes, health notes and the AI-import JSON box.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible rows. Default 3. */
  rows?: number;
  className?: string;
}

export function Textarea(props: TextareaProps): JSX.Element;
