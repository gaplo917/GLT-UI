import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label rendered to the right of the switch. */
  label?: React.ReactNode;
}

/**
 * Toggle switch built on a native checkbox (via peer styling) so it stays
 * accessible and works uncontrolled in static export.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-2 text-base text-[var(--text-color)]',
        disabled && 'opacity-60',
        className
      )}
    >
      <span className="relative inline-flex">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span className="h-5 w-9 rounded-full bg-[var(--border-color)] transition-colors peer-checked:bg-[var(--brand-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--brand-primary)] peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--bg-color)] shadow transition-transform peer-checked:translate-x-4" />
      </span>
      {label && <span>{label}</span>}
    </label>
  )
);
Switch.displayName = 'Switch';

export default Switch;
