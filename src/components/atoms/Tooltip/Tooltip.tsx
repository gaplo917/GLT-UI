'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn.js';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Text shown in the tooltip bubble. */
  content: React.ReactNode;
  side?: TooltipSide;
  children: React.ReactNode;
}

type Coords = { top: number; left: number };

/**
 * Hover/focus tooltip. Renders the bubble in a portal with `position: fixed`
 * so parent cards, tables, and `overflow-x-auto` shells cannot clip it.
 */
export function Tooltip({
  content,
  side = 'top',
  children,
  className,
  ...props
}: TooltipProps) {
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<Coords | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    let top = r.top;
    let left = r.left + r.width / 2;
    if (side === 'top') {
      top = r.top - gap;
    } else if (side === 'bottom') {
      top = r.bottom + gap;
    } else if (side === 'left') {
      top = r.top + r.height / 2;
      left = r.left - gap;
    } else {
      top = r.top + r.height / 2;
      left = r.right + gap;
    }
    setCoords({ top, left });
  }, [side]);

  const show = React.useCallback(() => {
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  const hide = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onReposition = () => updatePosition();
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open, updatePosition]);

  const transform =
    side === 'top'
      ? 'translate(-50%, -100%)'
      : side === 'bottom'
        ? 'translate(-50%, 0)'
        : side === 'left'
          ? 'translate(-100%, -50%)'
          : 'translate(0, -50%)';

  const bubble =
    mounted && open && coords
      ? createPortal(
          <span
            role="tooltip"
            className={cn(
              'pointer-events-none fixed z-[100] w-max max-w-xs whitespace-normal rounded-md',
              'bg-[var(--strong-text-color)] px-2 py-1 text-xs text-[var(--bg-color)] shadow-md',
            )}
            style={{
              top: coords.top,
              left: coords.left,
              transform,
            }}
          >
            {content}
          </span>,
          document.body,
        )
      : null;

  return (
    <span
      ref={triggerRef}
      className={cn('relative inline-flex', className)}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...props}
    >
      {children}
      {bubble}
    </span>
  );
}

export default Tooltip;
