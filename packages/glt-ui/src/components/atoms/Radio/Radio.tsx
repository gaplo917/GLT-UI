import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label rendered to the right of the control. */
  label?: React.ReactNode;
}

/** Single radio control with optional inline label. */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        id={id}
        type="radio"
        className={cn(
          'h-4 w-4 border-[var(--border-color)] text-[var(--brand-primary)] accent-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]',
          className
        )}
        {...props}
      />
    );
    if (!label) return input;
    return (
      <label htmlFor={id} className="inline-flex items-center gap-2 text-base text-[var(--text-color)]">
        {input}
        <span>{label}</span>
      </label>
    );
  }
);
Radio.displayName = 'Radio';

export default Radio;
