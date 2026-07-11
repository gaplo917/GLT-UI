import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'p-1.5 text-sm',
  md: 'p-2 text-base',
  lg: 'p-3 text-lg',
};

export function TextArea({ className, inputSize = 'md', invalid = false, ...props }: TextAreaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full rounded border bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 disabled:opacity-60 disabled:cursor-not-allowed',
        sizeClasses[inputSize],
        invalid
          ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
          : 'border-[var(--border-color)] focus:ring-[var(--brand-primary)]',
        className
      )}
      {...props}
    />
  );
}
