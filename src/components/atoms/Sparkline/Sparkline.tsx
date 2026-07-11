'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { useInView } from '@/lib/motion.js';

export type SparklineIntent = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'current';
export type SparklineShape = 'line' | 'area' | 'bar';

export interface SparklineProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** The series to plot. Two or more points recommended. */
  data: number[];
  /** Rendering style. Defaults to `area`. */
  shape?: SparklineShape;
  /** Color token driving stroke/fill. Defaults to `brand`. */
  intent?: SparklineIntent;
  /** Pixel width of the drawing. Defaults to 96. */
  width?: number;
  /** Pixel height of the drawing. Defaults to 28. */
  height?: number;
  /** Stroke width for line/area. Defaults to 2. */
  strokeWidth?: number;
  /** Mark the final point with a dot. Defaults to true for line/area. */
  showLastDot?: boolean;
  /** Animate the draw when scrolled into view. Defaults to true. */
  animate?: boolean;
  /** Fixed value range; defaults to the data's own min/max. */
  min?: number;
  max?: number;
}

const intentText: Record<SparklineIntent, string> = {
  brand: 'text-[var(--brand-primary)]',
  info: 'text-[var(--color-info)]',
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-danger)]',
  neutral: 'text-[var(--secondary-text-color)]',
  current: 'text-current',
};

/**
 * A dependency-free inline trend chart — small enough to sit inside a table
 * cell, a stat, or a sentence. Renders as an SVG using `currentColor`, so it
 * inherits the intent token. Line/area draws animate in when scrolled into
 * view (skipped under `prefers-reduced-motion` via the `motion-reduce:` variant).
 */
export const Sparkline = React.forwardRef<HTMLSpanElement, SparklineProps>(
  (
    {
      data,
      shape = 'area',
      intent = 'brand',
      width = 96,
      height = 28,
      strokeWidth = 2,
      showLastDot = true,
      animate = true,
      min,
      max,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const [ref, inView] = useInView<HTMLSpanElement>({ once: true });

    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, ref]
    );

    const pad = strokeWidth + 1;
    const lo = min ?? Math.min(...data);
    const hi = max ?? Math.max(...data);
    const span = hi - lo || 1;
    const n = data.length;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    const x = (i: number) => (n <= 1 ? pad : pad + (i / (n - 1)) * innerW);
    const y = (v: number) => pad + innerH - ((v - lo) / span) * innerH;

    const points = data.map((v, i) => [x(i), y(v)] as const);
    const linePath = points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(2)} ${py.toFixed(2)}`).join(' ');
    const areaPath =
      n > 0
        ? `${linePath} L${x(n - 1).toFixed(2)} ${(height - pad).toFixed(2)} L${x(0).toFixed(2)} ${(height - pad).toFixed(2)} Z`
        : '';
    const lastX = points.length ? points[points.length - 1][0] : 0;
    const lastY = points.length ? points[points.length - 1][1] : 0;

    const drawn = !animate || inView;
    const barW = n > 0 ? innerW / n : innerW;

    return (
      <span
        ref={setRefs}
        className={cn('inline-block align-middle leading-none', intentText[intent], className)}
        {...props}
      >
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden="true">
          {shape === 'bar' ? (
            data.map((v, i) => {
              const bh = ((v - lo) / span) * innerH;
              return (
                <rect
                  key={i}
                  x={x(i) - barW * 0.35}
                  y={height - pad - bh}
                  width={barW * 0.7}
                  height={Math.max(1, bh)}
                  rx={1}
                  fill="currentColor"
                  className={cn(
                    'origin-bottom transition-transform duration-700 ease-out motion-reduce:transition-none',
                    drawn ? 'scale-y-100' : 'scale-y-0'
                  )}
                  style={{ transitionDelay: `${i * 40}ms`, transformBox: 'fill-box' }}
                />
              );
            })
          ) : (
            <>
              {shape === 'area' && areaPath && (
                <path
                  d={areaPath}
                  fill="currentColor"
                  className={cn(
                    'transition-opacity duration-700 ease-out motion-reduce:transition-none',
                    drawn ? 'opacity-15' : 'opacity-0'
                  )}
                />
              )}
              <path
                d={linePath}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className={cn(
                  '[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[900ms] ease-out motion-reduce:transition-none',
                  drawn ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:1]'
                )}
              />
              {showLastDot && points.length > 0 && (
                <circle
                  cx={lastX}
                  cy={lastY}
                  r={strokeWidth + 0.5}
                  fill="currentColor"
                  className={cn('transition-opacity duration-300 ease-out motion-reduce:transition-none', drawn ? 'opacity-100' : 'opacity-0')}
                  style={{ transitionDelay: drawn ? '700ms' : '0ms' }}
                />
              )}
            </>
          )}
        </svg>
      </span>
    );
  }
);
Sparkline.displayName = 'Sparkline';

export default Sparkline;
