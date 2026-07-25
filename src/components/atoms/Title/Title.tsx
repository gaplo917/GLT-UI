import * as React from 'react';
import { cn } from '@/lib/cn.js';

/** Heading scale, 1 (largest) through 6 (smallest) — mirrors Bulma's title sizes. */
export type TitleSize = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Rendered element. Defaults to a heading matching `size` (e.g. size 3 → h3). */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  /** Visual size, 1–6. Defaults to 3. */
  size?: TitleSize;
}

const titleSizeClasses: Record<TitleSize, string> = {
  1: 'text-5xl',
  2: 'text-4xl',
  3: 'text-3xl',
  4: 'text-2xl',
  5: 'text-xl',
  6: 'text-base',
};

const headingFor = (size: TitleSize) => `h${size}` as const;

/**
 * Strong heading (sizes 1–6). Portal uses Title only (Subtitle removed).
 */
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ as, size = 3, className, ...props }, ref) => {
    const Component = (as ?? headingFor(size)) as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          'font-semibold leading-tight tracking-tight text-[var(--strong-text-color)]',
          titleSizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Title.displayName = 'Title';

export default Title;
