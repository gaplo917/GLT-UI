import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 px-2 text-sm',
  md: 'px-2 py-1.5 text-base',
  lg: 'h-12 px-3 text-lg',
};

export function TextInput({ className, inputSize = 'md', invalid = false, ...props }: TextInputProps) {
  return (
    <input
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
