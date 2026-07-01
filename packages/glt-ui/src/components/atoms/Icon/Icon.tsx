import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type IconTone = 'inherit' | 'brand' | 'secondary' | 'strong' | 'default';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The glyph/emoji/SVG node to render. Defaults to a star. */
  icon?: React.ReactNode;
  /**
   * Optional text label rendered after the glyph. When omitted the icon is
   * treated as decorative and marked `aria-hidden`.
   */
  label?: React.ReactNode;
  /** Colour of the glyph. Defaults to `brand`; use `inherit` for contextual/decorative icons. */
  tone?: IconTone;
}

const toneClasses: Record<IconTone, string> = {
  inherit: 'text-inherit',
  brand: 'text-[var(--brand-primary)]',
  secondary: 'text-[var(--secondary-text-color)]',
  strong: 'text-[var(--strong-text-color)]',
  default: 'text-[var(--text-color)]',
};

/**
 * A single icon — an emoji, unicode glyph, or SVG node. Use it decoratively on
 * its own (aria-hidden), or pass a `label` to render an accessible glyph + text
 * pairing. `tone="inherit"` lets the surrounding context set the colour.
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ icon = '★', label, tone = 'brand', className, ...props }, ref) => {
    if (label == null) {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          className={cn('inline-flex select-none items-center justify-center', toneClasses[tone], className)}
          {...props}
        >
          {icon}
        </span>
      );
    }
    return (
      <span ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
        <span aria-hidden="true" className={cn('select-none', toneClasses[tone])}>
          {icon}
        </span>
        <span className="text-base">{label}</span>
      </span>
    );
  }
);
Icon.displayName = 'Icon';

export default Icon;
