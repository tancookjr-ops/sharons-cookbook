import * as React from 'react';

/**
 * A centred, dashed-border panel shown when a list or view has no content
 * yet ("Your cookbook is empty", "No harvests logged yet").
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional call-to-action, typically a <Button>. */
  action?: React.ReactNode;
  className?: string;
  /** The message. */
  children?: React.ReactNode;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
