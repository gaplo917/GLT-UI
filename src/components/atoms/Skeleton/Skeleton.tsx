import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rounded shape preset. */
  shape?: 'line' | 'block' | 'circle';
  /** When shape is 'line', render this many stacked line bars. */
  lines?: number;
  /** Explicit width (CSS length or number of px). Overrides the shape default. */
  width?: string | number;
  /** Explicit height (CSS length or number of px). Overrides the shape default. */
  height?: string | number;
}

const shapeClasses: Record<NonNullable<SkeletonProps['shape']>, string> = {
  line: 'h-4 w-full rounded',
  block: 'h-24 w-full rounded-lg',
  circle: 'h-10 w-10 rounded-full',
};

/** Content placeholder shown while data loads. */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = 'line', lines, width, height, style, ...props }, ref) => {
    const sizeStyle: React.CSSProperties = { ...style };
    if (width != null) sizeStyle.width = width;
    if (height != null) sizeStyle.height = height;

    if (shape === 'line' && lines != null && lines > 1) {
      return (
        <div ref={ref} aria-hidden="true" className={cn('space-y-2', className)} style={style} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'animate-pulse bg-[var(--border-color)]',
                shapeClasses.line,
                i === lines - 1 && 'w-2/3'
              )}
            />
          ))}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse bg-[var(--border-color)]', shapeClasses[shape], className)}
        style={sizeStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export default Skeleton;
