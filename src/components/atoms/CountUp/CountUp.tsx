'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { easeOutCubic, useInView, usePrefersReducedMotion } from '../../../lib/motion.js';

export interface CountUpProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Target value to count to. */
  to: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Animation duration in ms. Defaults to 1200. */
  duration?: number;
  /** Decimal places to show. Defaults to 0. */
  decimals?: number;
  /** Prefix rendered before the number (e.g. "$"). */
  prefix?: string;
  /** Suffix rendered after the number (e.g. "%", "ms"). */
  suffix?: string;
  /** Thousands separator (e.g. ","). Empty by default. */
  separator?: string;
  /** Start counting only once scrolled into view. Defaults to true. */
  startOnView?: boolean;
  /** Fully custom formatter; overrides decimals/separator/prefix/suffix. */
  format?: (value: number) => string;
}

function defaultFormat(value: number, decimals: number, separator: string, prefix: string, suffix: string): string {
  const fixed = value.toFixed(decimals);
  let out = fixed;
  if (separator) {
    const [intPart, dec] = fixed.split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    out = dec != null ? `${grouped}.${dec}` : grouped;
  }
  return `${prefix}${out}${suffix}`;
}

/**
 * A number that animates from `from` to `to` with an ease-out ramp — the house
 * way to make a headline metric feel alive. Starts when scrolled into view and
 * respects `prefers-reduced-motion` (jumps straight to the final value). Uses
 * `tabular-nums` so the width doesn't jitter mid-count.
 */
export const CountUp = React.forwardRef<HTMLSpanElement, CountUpProps>(
  (
    {
      to,
      from = 0,
      duration = 1200,
      decimals = 0,
      prefix = '',
      suffix = '',
      separator = '',
      startOnView = true,
      format,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const [ref, inView] = useInView<HTMLSpanElement>({ once: true });
    const reduced = usePrefersReducedMotion();
    const [value, setValue] = React.useState(from);

    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, ref]
    );

    const active = startOnView ? inView : true;

    React.useEffect(() => {
      if (!active) return;
      if (reduced || duration <= 0) {
        setValue(to);
        return;
      }
      let raf = 0;
      let start: number | null = null;
      const step = (now: number) => {
        if (start == null) start = now;
        const t = Math.min(1, (now - start) / duration);
        setValue(from + (to - from) * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [active, reduced, from, to, duration]);

    const text = format ? format(value) : defaultFormat(value, decimals, separator, prefix, suffix);

    return (
      <span ref={setRefs} className={cn('tabular-nums', className)} {...props}>
        {text}
      </span>
    );
  }
);
CountUp.displayName = 'CountUp';

export default CountUp;
