import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;
export type GridGap = 0 | 1 | 2 | 3 | 4 | 6 | 8;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base column count. */
  columns?: GridColumns;
  /** Column count from the `md` breakpoint up (responsive). */
  mdColumns?: GridColumns;
  gap?: GridGap;
}

const colClasses: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const mdColClasses: Record<GridColumns, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const gapClasses: Record<GridGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

/** Responsive CSS grid primitive with token gaps and optional md breakpoint. */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 1, mdColumns, gap = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid', colClasses[columns], mdColumns && mdColClasses[mdColumns], gapClasses[gap], className)}
      {...props}
    />
  )
);
Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span (1–12) on the 12-col track. */
  span?: number;
}

/** Optional grid child that spans N columns of a 12-column grid. */
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, style, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={span ? { gridColumn: `span ${span} / span ${span}`, ...style } : style}
      {...props}
    />
  )
);
GridItem.displayName = 'GridItem';

export default Grid;
