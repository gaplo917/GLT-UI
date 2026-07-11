import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface LevelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Keep the level horizontal on mobile instead of stacking the left/right
   * groups (mirrors Bulma's `is-mobile`).
   */
  mobile?: boolean;
}

/**
 * A multi-purpose horizontal level that can contain almost any element.
 * Compose it from `LevelLeft` / `LevelRight` groups and `LevelItem`s — or drop
 * `LevelItem`s straight in for an evenly-spread, centered row. Whatever you put
 * inside is always vertically centered.
 *
 * By default the left and right groups stack on mobile; pass `mobile` to keep
 * everything on one row.
 */
export const Level = React.forwardRef<HTMLDivElement, LevelProps>(
  ({ className, mobile = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex gap-3',
        mobile
          ? 'flex-row items-center justify-between'
          : 'flex-col items-stretch sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      {...props}
    />
  )
);
Level.displayName = 'Level';

/** Left-hand group of level items. */
export const LevelLeft = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3', className)} {...props} />
  )
);
LevelLeft.displayName = 'LevelLeft';

/** Right-hand group of level items. */
export const LevelRight = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3', className)} {...props} />
  )
);
LevelRight.displayName = 'LevelRight';

export interface LevelItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Let this item grow to fill the free space (e.g. a search field). */
  grow?: boolean;
}

/**
 * A single level cell. Its contents are centered; it neither grows nor shrinks
 * by default so items keep their natural size. Put anything inside — a title, a
 * button, a text input, a badge, or plain text.
 */
export const LevelItem = React.forwardRef<HTMLDivElement, LevelItemProps>(
  ({ className, grow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-center', grow ? 'grow' : 'grow-0 shrink-0', className)}
      {...props}
    />
  )
);
LevelItem.displayName = 'LevelItem';

export default Level;
