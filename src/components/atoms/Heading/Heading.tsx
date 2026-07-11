import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level (h1–h6). */
  level?: HeadingLevel;
  /** Visual size override, independent of semantic level. */
  size?: HeadingLevel;
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl font-bold tracking-tight',
  2: 'text-3xl font-bold tracking-tight',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold uppercase tracking-wide',
};

/** Semantic heading with a decoupled visual size scale. */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, size, className, ...props }, ref) => {
    const Component = `h${level}` as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn('text-[var(--strong-text-color)]', sizeClasses[size ?? level], className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export default Heading;
