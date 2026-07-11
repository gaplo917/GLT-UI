'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Spinner } from '@/components/atoms/Spinner/Spinner.js';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'danger'
  | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)] hover:brightness-95 active:brightness-90 border border-transparent',
  secondary:
    'bg-[var(--card-bg-color)] text-[var(--strong-text-color)] hover:bg-[var(--border-color)] border border-[var(--border-color)]',
  outline:
    'bg-transparent text-[var(--brand-primary)] border border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-foreground)]',
  ghost:
    'bg-transparent text-[var(--text-color)] hover:bg-[var(--card-bg-color)] border border-transparent',
  link: 'bg-transparent text-[var(--brand-primary)] border border-transparent hover:underline',
  danger:
    'bg-[var(--color-danger)] text-[var(--color-on-status)] hover:brightness-95 active:brightness-90 border border-transparent',
  success:
    'bg-[var(--color-success)] text-[var(--color-on-status)] hover:brightness-95 active:brightness-90 border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded',
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-base rounded-lg',
  lg: 'h-12 px-6 text-lg rounded-xl',
  icon: 'h-10 w-10 p-0 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isLink = variant === 'link';
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none select-none interactive',
          variantClasses[variant],
          isLink ? 'h-auto p-0' : sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
