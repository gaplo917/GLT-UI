'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { CountUp } from '@/components/atoms/CountUp/CountUp.js';
import { Sparkline, type SparklineIntent } from '@/components/atoms/Sparkline/Sparkline.js';
import { Surface } from '@/components/atoms/Surface/Surface.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface StatMetricProps {
  label: string;
  /** The headline value. Optional when `countTo` supplies an animated number instead. */
  value?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Supporting line under the value (string or rich content, e.g. citations). */
  hint?: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  /**
   * When set, the big value animates up to this number on scroll (via CountUp).
   * Overrides `value` for display. Pair with `decimals` / `separator`.
   */
  countTo?: number;
  /** Decimals for `countTo`. Defaults to 0. */
  decimals?: number;
  /** Thousands separator for `countTo`. */
  separator?: string;
  /** A small trend series drawn as a Sparkline beneath the value. */
  trend?: number[];
  /** Color of the trend sparkline. Defaults to `brand`. */
  trendIntent?: SparklineIntent;
}

/** A single headline metric (label · big value · hint) on a centered surface. */
export function StatMetric({
  label,
  value,
  suffix,
  hint,
  interactive = false,
  onClick,
  className,
  countTo,
  decimals = 0,
  separator,
  trend,
  trendIntent = 'brand',
}: StatMetricProps) {
  return (
    <Surface
      tone="plain"
      bordered
      radius="lg"
      padding="md"
      align="center"
      onClick={onClick}
      className={cn(interactive && 'interactive cursor-pointer', className)}
    >
      <Text as="div" size="base" tone="secondary" className="uppercase tracking-wide">
        {label}
      </Text>
      <Text
        as="div"
        size="6xl"
        weight="semibold"
        tone="strong"
        className="mt-1 flex items-baseline justify-center gap-1 tabular-nums"
      >
        <span>{countTo != null ? <CountUp to={countTo} decimals={decimals} separator={separator} /> : value}</span>
        {suffix != null && (
          <Text as="span" size="3xl" tone="secondary" weight="medium">
            {suffix}
          </Text>
        )}
      </Text>
      {trend != null && trend.length > 1 && (
        <Sparkline data={trend} intent={trendIntent} width={120} height={32} className="mt-3" />
      )}
      {hint != null && (
        <Text as="div" size="base" className="mt-2">
          {hint}
        </Text>
      )}
    </Surface>
  );
}

export default StatMetric;
