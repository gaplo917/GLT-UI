import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Title } from '../../atoms/Title/Title.js';
import { Text } from '../../atoms/Text/Text.js';
import { Button } from '../../atoms/Button/Button.js';

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
 * An all-around flexible, composable surface. Mix and match the sub-parts —
 * `CardHeader` (with `CardHeaderTitle` / `CardHeaderIcon`), `CardImage`,
 * `CardContent`, and `CardFooter` (with `CardFooterItem`) — in any order.
 *
 * `overflow-hidden` keeps a full-bleed `CardImage` clipped to the rounded
 * corners. The container has no padding by default so headers, images, and
 * footers can sit flush to the edge; `CardContent` supplies the inner padding.
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

/** A horizontal bar with a subtle shadow, sitting flush at the top of a card. */
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-stretch border-b border-[var(--border-color)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardHeaderTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Center the title within the header bar instead of left-aligning it. */
  centered?: boolean;
}

/** Bold, left-aligned title text inside a `CardHeader` — composes the Text atom. */
export const CardHeaderTitle = React.forwardRef<HTMLDivElement, CardHeaderTitleProps>(
  ({ className, centered = false, ...props }, ref) => (
    <Text
      ref={ref as React.Ref<HTMLElement>}
      as="div"
      weight="semibold"
      tone="strong"
      className={cn(
        'flex flex-1 items-center gap-2 px-4 py-3',
        centered ? 'justify-center' : 'justify-start',
        className
      )}
      {...props}
    />
  )
);
CardHeaderTitle.displayName = 'CardHeaderTitle';

/** A trailing slot in the header bar for an icon or icon button — composes the Button atom. */
export const CardHeaderIcon = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = 'button', ...props }, ref) => (
    <Button
      ref={ref}
      type={type}
      variant="ghost"
      className={cn(
        'h-auto rounded-none px-4 py-3 text-[var(--secondary-text-color)] hover:translate-y-0 hover:bg-transparent hover:text-[var(--text-color)]',
        className
      )}
      {...props}
    />
  )
);
CardHeaderIcon.displayName = 'CardHeaderIcon';

export interface CardImageProps extends React.HTMLAttributes<HTMLElement> {
  /** Image source; when set, renders a full-width `<img>`. */
  src?: string;
  alt?: string;
}

/**
 * A full-width media container. Pass `src`/`alt` to render a responsive image,
 * or drop in your own child (e.g. a placeholder or `next/image`).
 */
export const CardImage = React.forwardRef<HTMLElement, CardImageProps>(
  ({ className, src, alt = '', children, ...props }, ref) => (
    <figure ref={ref as React.Ref<HTMLElement>} className={cn('m-0', className)} {...props}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="block h-auto w-full" />
      ) : (
        children
      )}
    </figure>
  )
);
CardImage.displayName = 'CardImage';

/** A multi-purpose, padded container for the card's main content. */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 p-5 text-[var(--text-color)]', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

/** A horizontal list of controls at the foot of a card. */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-stretch border-t border-[var(--border-color)]', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

/** A repeatable, evenly-sized cell within a `CardFooter`, divided by a rule. */
export const CardFooterItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 p-3 text-[var(--text-color)] [&:not(:last-child)]:border-r [&:not(:last-child)]:border-[var(--border-color)]',
        className
      )}
      {...props}
    />
  )
);
CardFooterItem.displayName = 'CardFooterItem';

/** Generic bold title, usable anywhere inside a card — composes the Title atom. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Title ref={ref} as="h3" size={5} className={className} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

/** Generic secondary description text, usable inside a card — composes the Text atom. */
export const CardDescription = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} as="p" size="base" tone="secondary" className={className} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export default Card;
