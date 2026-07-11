import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TextTone = 'default' | 'secondary' | 'strong' | 'brand' | 'danger' | 'success' | 'inherit';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered element. Defaults to <p>. */
  as?: 'p' | 'span' | 'div' | 'label';
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
  /** Truncate to a single line with an ellipsis. */
  truncate?: boolean;
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

const toneClasses: Record<TextTone, string> = {
  default: 'text-[var(--text-color)]',
  secondary: 'text-[var(--secondary-text-color)]',
  strong: 'text-[var(--strong-text-color)]',
  brand: 'text-[var(--brand-primary)]',
  danger: 'text-[var(--color-danger)]',
  success: 'text-[var(--color-success)]',
  /** Inherit the surrounding colour — for solid/tinted contexts (buttons, alerts). */
  inherit: 'text-inherit',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** Token-driven text with size/tone/weight/alignment presets. */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = 'p', size = 'base', tone = 'default', weight = 'normal', align, truncate = false, className, ...props }, ref) => {
    const Component = as as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          toneClasses[tone],
          weightClasses[weight],
          align && alignClasses[align],
          truncate && 'truncate',
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export default Text;
