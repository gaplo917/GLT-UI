import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional inline label centered on a horizontal rule. */
  label?: React.ReactNode;
}

/** Thin token-driven separator, horizontal or vertical. */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, role = 'separator', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role={role}
          aria-orientation="vertical"
          className={cn('inline-block w-px self-stretch bg-[var(--border-color)]', className)}
          {...props}
        />
      );
    }
    if (label) {
      return (
        <div
          ref={ref}
          role={role}
          className={cn('flex items-center gap-3 text-sm text-[var(--secondary-text-color)]', className)}
          {...props}
        >
          <span className="h-px flex-1 bg-[var(--border-color)]" />
          {label}
          <span className="h-px flex-1 bg-[var(--border-color)]" />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        role={role}
        aria-orientation="horizontal"
        className={cn('h-px w-full bg-[var(--border-color)]', className)}
        {...props}
      />
    );
  }
);
Divider.displayName = 'Divider';

export default Divider;
