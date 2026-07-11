'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { useInView } from '@/lib/motion.js';
import { CountUp } from '@/components/atoms/CountUp/CountUp.js';
import { Text } from '@/components/atoms/Text/Text.js';

export type ProgressRingIntent = 'brand' | 'info' | 'success' | 'warning' | 'danger';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. */
  value: number;
  /** Value that represents a full ring. Defaults to 100. */
  max?: number;
  /** Diameter in px. Defaults to 96. */
  size?: number;
  /** Ring thickness in px. Defaults to 8. */
  thickness?: number;
  /** Arc color token. Defaults to `brand`. */
  intent?: ProgressRingIntent;
  /** Show the numeric value in the center. Defaults to true. */
  showValue?: boolean;
  /** Suffix for the center value (e.g. "%"). Defaults to "%". */
  suffix?: string;
  /** Decimal places for the center value. Defaults to 0. */
  decimals?: number;
  /** Small caption under the value. */
  label?: React.ReactNode;
  /** Animate the arc + count when scrolled into view. Defaults to true. */
  animate?: boolean;
}

const intentStroke: Record<ProgressRingIntent, string> = {
  brand: 'stroke-[var(--brand-primary)]',
  info: 'stroke-[var(--color-info)]',
  success: 'stroke-[var(--color-success)]',
  warning: 'stroke-[var(--color-warning)]',
  danger: 'stroke-[var(--color-danger)]',
};

/**
 * A circular percentage indicator. The arc sweeps in and the center value
 * counts up when scrolled into view; both settle instantly under
 * `prefers-reduced-motion`. Composes the CountUp + Text atoms for the label.
 */
export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      value,
      max = 100,
      size = 96,
      thickness = 8,
      intent = 'brand',
      showValue = true,
      suffix = '%',
      decimals = 0,
      label,
      animate = true,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const [ref, inView] = useInView<HTMLDivElement>({ once: true });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, ref]
    );

    const pct = Math.min(1, Math.max(0, value / max));
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    const active = !animate || inView;
    const offset = active ? c * (1 - pct) : c;

    return (
      <div
        ref={setRefs}
        className={cn('relative inline-grid place-items-center', className)}
        style={{ width: size, height: size, ...style }}
        role="img"
        aria-label={`${((value / max) * 100).toFixed(decimals)}%`}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            className="stroke-[var(--border-color)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={cn(intentStroke[intent], 'transition-[stroke-dashoffset] duration-[1100ms] ease-out motion-reduce:transition-none')}
          />
        </svg>
        {(showValue || label != null) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
            {showValue && (
              <Text as="span" size="xl" weight="semibold" tone="strong">
                <CountUp to={value} decimals={decimals} suffix={suffix} startOnView={animate} />
              </Text>
            )}
            {label != null && (
              <Text as="span" size="sm" tone="secondary" className="mt-0.5">
                {label}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  }
);
ProgressRing.displayName = 'ProgressRing';

export default ProgressRing;
