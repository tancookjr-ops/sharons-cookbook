import * as React from 'react';

export interface SegmentOption {
  /** Value emitted on select. */
  value: string;
  /** Visible label. */
  label: React.ReactNode;
  /** Optional dimmed suffix (e.g. a count). */
  hint?: React.ReactNode;
}

/**
 * A pill-shaped set of mutually-exclusive options (a segmented control /
 * tab strip). Used for planner views, pantry locations and garden tabs.
 */
export interface SegmentedControlProps {
  options: SegmentOption[];
  /** Currently-selected value. */
  value: string;
  /** Called with the new value on select. */
  onChange?: (value: string) => void;
  className?: string;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
