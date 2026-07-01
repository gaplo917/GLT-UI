'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Text } from '../../atoms/Text/Text.js';
import { Button } from '../../atoms/Button/Button.js';
import { Icon } from '../../atoms/Icon/Icon.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertAppearance = 'soft' | 'solid' | 'outline';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  appearance?: AlertAppearance;
  title?: React.ReactNode;
  /** Icon shown in the badge. Defaults per variant; pass `false` to hide the badge. */
  icon?: React.ReactNode | false;
  /** Trailing action controls (buttons/links) rendered below the message. */
  actions?: React.ReactNode;
  /** Show a trailing dismiss button. */
  dismissible?: boolean;
  /** Called when the alert is dismissed. */
  onDismiss?: () => void;
}

const accentByVariant: Record<AlertVariant, string> = {
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
};

const defaultIcon: Record<AlertVariant, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  danger: '✕',
};

const appearanceClasses: Record<AlertAppearance, string> = {
  soft: 'bg-[var(--alert-accent)]/[0.07] border border-[var(--alert-accent)]/25 text-[var(--text-color)]',
  solid: 'bg-[var(--alert-accent)] border border-transparent text-[var(--color-on-status)]',
  outline: 'bg-[var(--bg-color)] border border-[var(--alert-accent)]/45 text-[var(--text-color)]',
};

/**
 * A notification-style status message. Unlike Callout (an editorial, in-prose
 * block with a left accent stripe), Alert reads as UI feedback: a filled
 * circular icon badge, an all-round soft border + subtle shadow, an optional
 * actions row, and a dismiss control.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      appearance = 'soft',
      title,
      icon,
      actions,
      dismissible = false,
      onDismiss,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;

    const isSolid = appearance === 'solid';
    const glyph = icon === false ? null : icon ?? defaultIcon[variant];

    return (
      <div
        ref={ref}
        role={variant === 'danger' || variant === 'warning' ? 'alert' : 'status'}
        style={{ ['--alert-accent' as string]: accentByVariant[variant], ...style }}
        className={cn('flex gap-3 rounded-xl p-4 text-base shadow-sm', appearanceClasses[appearance], className)}
        {...props}
      >
        {glyph != null && (
          <span
            aria-hidden="true"
            className={cn(
              'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold',
              isSolid ? 'bg-white/20 text-[var(--color-on-status)]' : 'bg-[var(--alert-accent)] text-[var(--color-on-status)]'
            )}
          >
            <Icon icon={glyph} tone="inherit" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <Text as="div" weight="semibold" tone={isSolid ? 'inherit' : 'strong'}>
              {title}
            </Text>
          )}
          {children && (
            <Text
              as="div"
              size="sm"
              tone={isSolid ? 'inherit' : 'secondary'}
              className={cn(title && 'mt-0.5', isSolid && 'opacity-90')}
            >
              {children}
            </Text>
          )}
          {actions && <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>}
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
            className={cn(
              '-mr-1 -mt-1 h-auto w-auto shrink-0 self-start rounded p-1 leading-none opacity-60 hover:translate-y-0 hover:bg-transparent hover:opacity-100',
              isSolid
                ? 'text-inherit focus-visible:ring-white/60'
                : 'text-[var(--text-color)] focus-visible:ring-[var(--alert-accent)]'
            )}
          >
            <Icon icon="✕" tone="inherit" />
          </Button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export default Alert;
