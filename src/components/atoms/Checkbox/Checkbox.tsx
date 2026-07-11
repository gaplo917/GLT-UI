import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label rendered to the right of the box. */
  label?: React.ReactNode;
}

/** Single checkbox control with optional inline label. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-[var(--border-color)] text-[var(--brand-primary)] accent-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]',
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
Checkbox.displayName = 'Checkbox';

export default Checkbox;
