import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Renders a required marker after the label text. */
  required?: boolean;
}

/** Form field label with optional required marker. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-[var(--strong-text-color)]', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-[var(--brand-primary)]">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

export default Label;
