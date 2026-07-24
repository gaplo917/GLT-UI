'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type BadgeVariant =
  | 'default'
  | 'fact'
  | 'pill'
  | 'outline'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Render a small leading status dot that contrasts with the badge. */
  dot?: boolean;
  /** Render a trailing remove button. */
  removable?: boolean;
  onRemove?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--card-bg-color)] text-[var(--text-color)] border border-[var(--border-color)]',
  fact: 'bg-[var(--mark-color)]/30 text-[var(--strong-text-color)] font-medium',
  pill: 'bg-[var(--card-bg-color)] text-[var(--secondary-text-color)] rounded-full',
  outline: 'border border-[var(--brand-primary)] text-[var(--brand-primary)]',
  info: 'bg-[var(--color-info)] text-[var(--color-on-status)]',
  success: 'bg-[var(--color-success)] text-[var(--color-on-status)]',
  warning: 'bg-[var(--color-warning)] text-[var(--color-on-status)]',
  danger: 'bg-[var(--color-danger)] text-[var(--color-on-status)]',
  neutral: 'bg-[var(--secondary-text-color)]/15 text-[var(--secondary-text-color)]',
};

/** Chip scale — roomy enough for tag rows on catalog cards and dense UI labels. */
const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2.5 py-0.5 leading-5',
  md: 'text-sm px-3 py-1 leading-5',
  lg: 'text-base px-3.5 py-1.5 leading-6',
};

const dotSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-1.5 w-1.5',
  lg: 'h-2 w-2',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[var(--brand-primary)]',
  fact: 'bg-[var(--brand-primary)]',
  pill: 'bg-current',
  outline: 'bg-current',
  info: 'bg-current',
  success: 'bg-current',
  warning: 'bg-current',
  danger: 'bg-current',
  neutral: 'bg-current',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'fact', size = 'md', dot, removable, onRemove, children, ...props },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('shrink-0 rounded-full', dotSizeClasses[size], dotColors[variant])}
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="inline-flex items-center justify-center leading-none"
        >
          ✕
        </button>
      )}
    </span>
  )
);
Badge.displayName = 'Badge';

export default Badge;
