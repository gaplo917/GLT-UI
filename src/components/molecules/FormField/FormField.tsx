import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Label } from '@/components/atoms/Label/Label.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** Associates the label with a control via htmlFor. */
  htmlFor?: string;
  required?: boolean;
  /** Helper/description text shown below the control. */
  hint?: React.ReactNode;
  /** Error message; when set, overrides the hint and marks the field invalid. */
  error?: React.ReactNode;
}

/** Wraps a control with a label, hint, and error message in a consistent stack. */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, required, hint, error, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-1.5', className)} {...props}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <Text as="p" size="sm" tone="brand">{error}</Text>
      ) : hint ? (
        <Text as="p" size="sm" tone="secondary">{hint}</Text>
      ) : null}
    </div>
  )
);
FormField.displayName = 'FormField';

export default FormField;
