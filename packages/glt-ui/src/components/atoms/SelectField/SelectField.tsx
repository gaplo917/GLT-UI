import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  className?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 pl-2 pr-8 text-sm',
  md: 'h-10 pl-2 pr-9 text-base',
  lg: 'h-12 pl-3 pr-10 text-lg',
};

const chevronOffset: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'right-2',
  md: 'right-2.5',
  lg: 'right-3',
};

export function SelectField({ options, className, inputSize = 'md', invalid = false, ...props }: SelectFieldProps) {
  return (
    <span className="relative block w-full">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          'block w-full appearance-none rounded border bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 disabled:opacity-60 disabled:cursor-not-allowed',
          sizeClasses[inputSize],
          invalid
            ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
            : 'border-[var(--border-color)] focus:ring-[var(--brand-primary)]',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text-color)]',
          chevronOffset[inputSize]
        )}
      >
        <path d="M6 8l4 4 4-4" />
      </svg>
    </span>
  );
}
