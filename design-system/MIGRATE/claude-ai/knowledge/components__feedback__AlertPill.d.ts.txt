import * as React from 'react';

/**
 * A pill-shaped status badge for inline alert strips (pantry expiry, low
 * stock, dashboard notices). Group several inside an `.alert-strip` row.
 */
export interface AlertPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Severity tone. Default "info". */
  tone?: 'danger' | 'warn' | 'info';
  className?: string;
  children?: React.ReactNode;
}

export function AlertPill(props: AlertPillProps): JSX.Element;
