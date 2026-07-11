import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type ListVariant = 'disc' | 'decimal' | 'none';
export type ListSpacing = 0 | 1 | 2 | 3;

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  /** Marker style. `decimal` implies an ordered list. */
  variant?: ListVariant;
  /** Element to render. Defaults to `ul` (or `ol` when variant is `decimal`). */
  as?: 'ul' | 'ol';
  /** Vertical gap between items. */
  spacing?: ListSpacing;
}

const variantClasses: Record<ListVariant, string> = {
  disc: 'list-disc pl-5',
  decimal: 'list-decimal pl-5',
  none: 'list-none pl-0',
};

const spacingClasses: Record<ListSpacing, string> = {
  0: '',
  1: 'space-y-1',
  2: 'space-y-2',
  3: 'space-y-3',
};

/** A token-driven list. Pair with ListItem for each entry. */
export const List = React.forwardRef<HTMLElement, ListProps>(
  ({ as, variant = 'disc', spacing = 1, className, ...props }, ref) => {
    const Component = (as ?? (variant === 'decimal' ? 'ol' : 'ul')) as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn('text-[var(--text-color)]', variantClasses[variant], spacingClasses[spacing], className)}
        {...props}
      />
    );
  }
);
List.displayName = 'List';

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement>;

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('leading-relaxed', className)} {...props} />
));
ListItem.displayName = 'ListItem';

export default List;
