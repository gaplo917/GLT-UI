import * as React from 'react';
import { cn } from '@/lib/cn.js';

/** Vertical rhythm applied between direct children (Tailwind spacing scale). */
export type BlockSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rendered element. Defaults to <div>. */
  as?: 'div' | 'section' | 'article' | 'main';
  /**
   * Consistent bottom margin inserted between direct children. Every child
   * except the last one receives it. Defaults to `6` (≈1.5rem — Bulma's block
   * spacing).
   */
  spacing?: BlockSpacing;
}

/** Each spacing step maps to a static child-margin utility so Tailwind can see it. */
const spacingClasses: Record<BlockSpacing, string> = {
  0: '',
  1: '[&>*:not(:last-child)]:mb-1',
  2: '[&>*:not(:last-child)]:mb-2',
  3: '[&>*:not(:last-child)]:mb-3',
  4: '[&>*:not(:last-child)]:mb-4',
  5: '[&>*:not(:last-child)]:mb-5',
  6: '[&>*:not(:last-child)]:mb-6',
  8: '[&>*:not(:last-child)]:mb-8',
  10: '[&>*:not(:last-child)]:mb-10',
  12: '[&>*:not(:last-child)]:mb-12',
};

/**
 * The most basic spacer. Block adds a consistent margin between its sibling
 * children so stacked elements — paragraphs, cards, media objects, anything —
 * keep an even vertical rhythm without bespoke margins on each item.
 *
 * Unlike `Stack` (a flex column with `gap`), Block spaces children with plain
 * bottom margins, so it works with elements whose own display matters (floats,
 * inline-block, mixed block content) and collapses margins the way prose does.
 */
export const Block = React.forwardRef<HTMLDivElement, BlockProps>(
  ({ as = 'div', spacing = 6, className, ...props }, ref) => {
    const Component = as as React.ElementType;
    return (
      <Component ref={ref} className={cn(spacingClasses[spacing], className)} {...props} />
    );
  }
);
Block.displayName = 'Block';

export default Block;
