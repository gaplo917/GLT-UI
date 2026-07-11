'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Text } from '../../atoms/Text/Text.js';
import { Button } from '../../atoms/Button/Button.js';
import { Icon } from '../../atoms/Icon/Icon.js';

/** Semantic intent of the callout. */
export type CalloutVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'tip'
  | 'note'
  | 'fact';

/** How the accent colour is applied. */
export type CalloutAppearance = 'soft' | 'outline' | 'solid' | 'plain';

export type CalloutSize = 'sm' | 'md' | 'lg';

/** Maps each variant to its accent CSS custom property. */
const accentVar: Record<CalloutVariant, string> = {
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  tip: 'var(--brand-primary)',
  fact: 'var(--brand-primary)',
  note: 'var(--secondary-text-color)',
};

/** Default leading glyph per variant (override via `icon`, hide with `icon={false}`). */
const defaultIcon: Record<CalloutVariant, string | null> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  danger: '✕',
  tip: '💡',
  fact: '★',
  note: null,
};

const sizeClasses: Record<CalloutSize, string> = {
  sm: 'p-3 text-sm gap-2',
  md: 'p-4 text-base gap-3',
  lg: 'p-5 text-lg gap-3',
};

/** All corners rounded — for appearances without a left accent stripe. */
const radiusClass: Record<CalloutSize, string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
};

/** Right corners only — keeps the left accent stripe a crisp straight line. */
const radiusRightClass: Record<CalloutSize, string> = {
  sm: 'rounded-r-md',
  md: 'rounded-r-lg',
  lg: 'rounded-r-xl',
};

const appearanceClasses: Record<CalloutAppearance, string> = {
  soft: 'bg-[var(--cal-accent)]/12 border-l-4 border-[var(--cal-accent)] text-[var(--text-color)]',
  outline: 'bg-transparent border border-[var(--cal-accent)] text-[var(--text-color)]',
  solid: 'bg-[var(--cal-accent)] text-[var(--color-on-status)] border border-transparent',
  plain: 'bg-transparent border-l-4 border-[var(--cal-accent)] text-[var(--text-color)]',
};

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: CalloutVariant;
  appearance?: CalloutAppearance;
  size?: CalloutSize;
  /** Bold heading line above the body. */
  title?: React.ReactNode;
  /** Small uppercase overline (e.g. a source or category). */
  label?: string;
  /** Custom icon node, or `false` to hide the default glyph. */
  icon?: React.ReactNode | false;
  /** Render a dismiss button; the callout removes itself on click. */
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Flexible message block for research prose and status notices.
 *
 * - 7 semantic variants (info/success/warning/danger/tip/note/fact)
 * - 4 appearances (soft/outline/solid/plain)
 * - optional title, overline label, icon, and dismiss control
 *
 * The `soft` and `plain` appearances carry a left accent stripe; their left
 * corners stay square so the stripe reads as a straight vertical line.
 */
export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = 'fact',
      appearance = 'soft',
      size = 'md',
      title,
      label,
      icon,
      dismissible = false,
      onDismiss,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;

    const glyph = icon === false ? null : icon ?? defaultIcon[variant];
    const isStatus = variant === 'warning' || variant === 'danger';
    const onSolid = appearance === 'solid';
    const hasLeftAccent = appearance === 'soft' || appearance === 'plain';

    return (
      <div
        ref={ref}
        role={isStatus ? 'alert' : 'note'}
        className={cn(
          'flex leading-relaxed',
          sizeClasses[size],
          hasLeftAccent ? radiusRightClass[size] : radiusClass[size],
          appearanceClasses[appearance],
          className
        )}
        style={{ ['--cal-accent']: accentVar[variant], ...style } as React.CSSProperties}
        {...props}
      >
        {glyph != null && (
          <Icon
            icon={glyph}
            tone="inherit"
            className={cn('mt-0.5 shrink-0', !onSolid && 'text-[var(--cal-accent)]')}
          />
        )}
        <div className="min-w-0 flex-1">
          {label && (
            <Text
              as="div"
              size="xs"
              weight="semibold"
              tone="inherit"
              className={cn(
                'mb-1 uppercase tracking-[1.5px]',
                onSolid ? 'opacity-80' : 'text-[var(--cal-accent)]'
              )}
            >
              {label}
            </Text>
          )}
          {title && (
            <Text as="div" weight="semibold" tone={onSolid ? 'inherit' : 'strong'} className="mb-0.5">
              {title}
            </Text>
          )}
          {/* On solid backgrounds skip prose-research (which forces --text-color) so
              text inherits the readable --color-on-status set on the container. */}
          <div className={onSolid ? 'space-y-2' : 'prose-research'}>{children}</div>
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            className="ml-1 h-auto w-auto shrink-0 rounded p-0.5 leading-none text-inherit opacity-60 hover:translate-y-0 hover:bg-transparent hover:opacity-100 focus-visible:ring-[var(--cal-accent)]"
          >
            <Icon icon="✕" tone="inherit" />
          </Button>
        )}
      </div>
    );
  }
);
Callout.displayName = 'Callout';

export default Callout;
