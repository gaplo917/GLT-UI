import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Text shown in the tooltip bubble. */
  content: React.ReactNode;
  side?: TooltipSide;
  children: React.ReactNode;
}

const sideClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * CSS-only tooltip (hover/focus driven) so it works in static export without
 * client JS. Wraps an inline trigger and reveals `content` on interaction.
 */
export function Tooltip({ content, side = 'top', children, className, ...props }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)} tabIndex={0} {...props}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-xs whitespace-normal rounded-md bg-[var(--strong-text-color)] px-2 py-1 text-xs text-[var(--bg-color)] opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100',
          sideClasses[side]
        )}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
