'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Text } from '../../atoms/Text/Text.js';

export interface ComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The panel revealed on the left of the divider (e.g. a baseline). */
  before: React.ReactNode;
  /** The panel revealed on the right of the divider (e.g. your method). */
  after: React.ReactNode;
  /** Small corner label for the `before` panel. */
  beforeLabel?: React.ReactNode;
  /** Small corner label for the `after` panel. */
  afterLabel?: React.ReactNode;
  /** Initial divider position as a percentage (0–100). Defaults to 50. */
  defaultPosition?: number;
  /** Fixed pixel height for the frame. Overrides `aspectRatio`. */
  height?: number;
  /** Width ÷ height ratio when `height` is not set. Defaults to 16/9. */
  aspectRatio?: number;
}

/**
 * A draggable before/after comparison — grab the divider (mouse, touch, or
 * arrow keys) to wipe between two panels. Built to put a baseline and a result
 * side by side. Both panels fill the same frame; keep them the same size.
 */
export function ComparisonSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  defaultPosition = 50,
  height,
  aspectRatio = 16 / 9,
  className,
  style,
  ...props
}: ComparisonSliderProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState(clamp(defaultPosition));
  const draggingRef = React.useRef(false);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [updateFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPosition((p) => clamp(p - 2));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setPosition((p) => clamp(p + 2));
      e.preventDefault();
    } else if (e.key === 'Home') {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setPosition(100);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full select-none overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--image-bg-color)]',
        className
      )}
      style={{ height, aspectRatio: height == null ? String(aspectRatio) : undefined, ...style }}
      {...props}
    >
      {/* after fills the frame */}
      <div className="absolute inset-0">{after}</div>
      {afterLabel != null && (
        <div className="pointer-events-none absolute right-2 top-2 z-10">
          <CornerLabel>{afterLabel}</CornerLabel>
        </div>
      )}

      {/* before clipped to the left of the divider */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {before}
        {beforeLabel != null && (
          <div className="pointer-events-none absolute left-2 top-2 z-10">
            <CornerLabel>{beforeLabel}</CornerLabel>
          </div>
        )}
      </div>

      {/* divider + handle */}
      <div className="absolute inset-y-0 z-20 w-0.5 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${position}%` }}>
        <button
          type="button"
          role="slider"
          aria-label="Comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onPointerDown={(e) => {
            draggingRef.current = true;
            updateFromClientX(e.clientX);
          }}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] shadow-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] motion-reduce:transition-none"
        >
          <span aria-hidden="true" className="text-sm leading-none tracking-tighter">
            ‹›
          </span>
        </button>
      </div>
    </div>
  );
}

function CornerLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      as="span"
      size="sm"
      weight="medium"
      tone="inherit"
      className="rounded bg-black/60 px-2 py-0.5 text-white"
    >
      {children}
    </Text>
  );
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export default ComparisonSlider;
