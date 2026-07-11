'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { useInView } from '../../../lib/motion.js';
import { Badge } from '../../atoms/Badge/Badge.js';
import { CountUp } from '../../atoms/CountUp/CountUp.js';
import { Stack } from '../../atoms/Stack/Stack.js';
import { Text } from '../../atoms/Text/Text.js';

export type BenchmarkIntent = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface BenchmarkItem {
  /** Row label — a method, model, or baseline name. */
  label: string;
  /** The score to plot. */
  value: number;
  /** Bar color token. Defaults to `neutral`, or `brand` for the winning row. */
  intent?: BenchmarkIntent;
  /** Force-highlight this row (otherwise the best row is highlighted automatically). */
  highlight?: boolean;
  /** Small note shown under the label, e.g. a citation or config. */
  note?: React.ReactNode;
}

export interface BenchmarkChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Rows to compare. */
  items: BenchmarkItem[];
  /** Full-bar value. Defaults to the largest item value (× 1.05 headroom). */
  max?: number;
  /** Unit suffix appended to every value (e.g. "%", " tok/s"). */
  unit?: string;
  /** Decimal places for values. Defaults to 1. */
  decimals?: number;
  /** Which direction wins, used to auto-highlight the best row. Defaults to 'higher'. */
  betterIs?: 'higher' | 'lower';
  /** Sort rows by value (best first). Defaults to false (keep input order). */
  sort?: boolean;
  /** Text of the badge on the winning row. Defaults to "Best". */
  bestLabel?: string;
  /** Heading rendered above the chart. */
  title?: React.ReactNode;
  /** Caption rendered below the chart. */
  caption?: React.ReactNode;
  /** Animate bars + values when scrolled into view. Defaults to true. */
  animate?: boolean;
}

const intentBar: Record<BenchmarkIntent, string> = {
  brand: 'bg-[var(--brand-primary)]',
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  neutral: 'bg-[var(--secondary-text-color)]/40',
};

/**
 * A horizontal bar comparison built for research results — "our method vs. the
 * baselines". Bars grow from zero and values count up when scrolled into view;
 * the winning row is highlighted with a brand bar and a badge. Composes the
 * Stack / Text / Badge / CountUp atoms and honors `prefers-reduced-motion`.
 */
export const BenchmarkChart = React.forwardRef<HTMLDivElement, BenchmarkChartProps>(
  (
    {
      items,
      max,
      unit = '',
      decimals = 1,
      betterIs = 'higher',
      sort = false,
      bestLabel = 'Best',
      title,
      caption,
      animate = true,
      className,
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

    const rows = sort
      ? [...items].sort((a, b) => (betterIs === 'higher' ? b.value - a.value : a.value - b.value))
      : items;

    const bestValue = items.reduce(
      (acc, it) => (betterIs === 'higher' ? Math.max(acc, it.value) : Math.min(acc, it.value)),
      betterIs === 'higher' ? -Infinity : Infinity
    );
    const anyExplicit = items.some((it) => it.highlight);
    const scaleMax = max ?? (Math.max(...items.map((it) => it.value)) * 1.05 || 1);
    const active = !animate || inView;

    return (
      <Stack ref={setRefs} gap={2} className={cn('w-full', className)} {...props}>
        {title != null && (
          <Text as="div" size="lg" weight="semibold" tone="strong">
            {title}
          </Text>
        )}
        <Stack gap={3} role="list" className="w-full">
          {rows.map((item, i) => {
            const isBest = item.highlight ?? (!anyExplicit && item.value === bestValue);
            const intent: BenchmarkIntent = item.intent ?? (isBest ? 'brand' : 'neutral');
            const pct = Math.min(100, Math.max(0, (item.value / scaleMax) * 100));
            return (
              <div key={`${item.label}-${i}`} role="listitem" className="w-full">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <Stack direction="row" gap={2} align="baseline" className="min-w-0">
                    <Text as="span" weight={isBest ? 'semibold' : 'normal'} tone={isBest ? 'strong' : 'default'} className="truncate">
                      {item.label}
                    </Text>
                    {isBest && (
                      <Badge variant="success" size="sm">
                        {bestLabel}
                      </Badge>
                    )}
                    {item.note != null && (
                      <Text as="span" size="sm" tone="secondary" className="truncate">
                        {item.note}
                      </Text>
                    )}
                  </Stack>
                  <Text as="span" weight={isBest ? 'semibold' : 'medium'} tone={isBest ? 'brand' : 'default'} className="shrink-0 tabular-nums">
                    <CountUp to={item.value} decimals={decimals} suffix={unit} startOnView={animate} />
                  </Text>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--border-color)]/50">
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-[1100ms] ease-out motion-reduce:transition-none',
                      intentBar[intent]
                    )}
                    style={{ width: active ? `${pct}%` : '0%', transitionDelay: `${i * 80}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </Stack>
        {caption != null && (
          <Text as="div" size="sm" tone="secondary">
            {caption}
          </Text>
        )}
      </Stack>
    );
  }
);
BenchmarkChart.displayName = 'BenchmarkChart';

export default BenchmarkChart;
