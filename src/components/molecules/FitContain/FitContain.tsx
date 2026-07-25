'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface FitContainProps {
  children: React.ReactNode;
  className?: string;
  /**
   * When true (or when remounted), re-measure immediately. Useful when a parent
   * dialog opens and the stage gains size after first paint.
   */
  active?: boolean;
  /** Natural width of the unscaled child board. */
  naturalW?: number;
  /** Natural height of the unscaled child board. */
  naturalH?: number;
  /** Inset (px) subtracted from stage before computing scale. Default 16. */
  pad?: number;
}

/**
 * Scales fixed naturalW×naturalH children to fit the parent (object-fit: contain).
 * Measures via ResizeObserver; children keep their layout at natural size.
 */
export function FitContain({
  children,
  className,
  active,
  naturalW = 960,
  naturalH = 540,
  pad = 16,
}: FitContainProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);

  const measure = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    if (sw < 1 || sh < 1) return;
    const next = Math.min((sw - pad) / naturalW, (sh - pad) / naturalH);
    setScale(Number.isFinite(next) && next > 0 ? next : 0.5);
  }, [naturalW, naturalH, pad]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, active]);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    window.addEventListener('resize', measure);
    const t = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 250);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [measure, active]);

  return (
    <div
      ref={stageRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: naturalW,
          height: naturalH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default FitContain;
