import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerIntent = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'current';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  intent?: SpinnerIntent;
  /** Accessible label announced to assistive tech. */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const intentTopColors: Record<SpinnerIntent, string> = {
  brand: 'border-t-[var(--brand-primary)]',
  info: 'border-t-[var(--color-info)]',
  success: 'border-t-[var(--color-success)]',
  warning: 'border-t-[var(--color-warning)]',
  danger: 'border-t-[var(--color-danger)]',
  current: 'border-t-current',
};

/** Indeterminate loading indicator using the brand primary token. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 'md', intent = 'brand', label = 'Loading', ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full',
        intent === 'current' ? 'border-current/30' : 'border-[var(--border-color)]',
        intentTopColors[intent],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Spinner.displayName = 'Spinner';

export default Spinner;
