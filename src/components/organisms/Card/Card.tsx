import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual surface treatment. */
  variant?: 'default' | 'research' | 'stat' | 'tech' | 'outline' | 'elevated';
  /** Interactive hover lift + pointer affordance. */
  interactive?: boolean;
  /**
   * Padding on the card container itself. Composable cards leave this `none`
   * (the default) and pad through `CardContent`; set it for a quick one-off
   * card with no sub-parts.
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-[var(--card-bg-color)] border border-[var(--border-color)]',
  research: 'bg-[var(--card-bg-color)] border border-[var(--border-color)] shadow-sm',
  stat: 'bg-[var(--bg-color)] border border-[var(--border-color)] text-center',
  tech: 'bg-[var(--card-bg-color)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]',
  outline: 'bg-transparent border border-[var(--border-color)]',
  elevated: 'bg-[var(--card-bg-color)] border border-[var(--border-color)] shadow-[var(--box-shadow)]',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

/**
 * Flexible card surface. Portal usage is `Card` + `CardContent` only.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, padding = 'none', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col overflow-hidden rounded-[var(--radius-card)] text-[var(--text-color)]',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && 'interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

/** Padded container for the card's main content. */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 p-5 text-[var(--text-color)]', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export default Card;
