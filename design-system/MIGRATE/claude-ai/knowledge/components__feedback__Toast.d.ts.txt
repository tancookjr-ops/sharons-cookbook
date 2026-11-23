import * as React from 'react';

/**
 * A transient confirmation message (ink surface, cream text) with a
 * coloured left border by tone. Shown bottom-centre and auto-dismissed in
 * the product ("Recipe saved", "Added to favourites").
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tone → left-border colour. Default "success". */
  tone?: 'success' | 'warn' | 'error';
  className?: string;
  children?: React.ReactNode;
}

export function Toast(props: ToastProps): JSX.Element;
