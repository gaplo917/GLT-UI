import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type MediaObjectSide = 'left' | 'right';
export type MediaObjectAlign = 'start' | 'center' | 'end';
export type MediaObjectGap = 0 | 1 | 2 | 3 | 4 | 6;

export interface MediaObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Fixed-size media element shown beside the content — an avatar, image,
   * icon, or thumbnail. It never shrinks; the content flexes to fill the rest.
   */
  media?: React.ReactNode;
  /** @deprecated Use `media`. Kept for backwards compatibility. */
  thumbnail?: React.ReactNode;
  /** Which side the media sits on. Defaults to `left`. */
  side?: MediaObjectSide;
  /** Vertical alignment of the media against the content block. */
  align?: MediaObjectAlign;
  /** Spacing between the media and the content. */
  gap?: MediaObjectGap;
  /**
   * Optional trailing slot pinned to the far end of the row — actions, a
   * timestamp, an overflow menu. Also never shrinks.
   */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const alignClass: Record<MediaObjectAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

const gapClass: Record<MediaObjectGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
};

/**
 * The classic **media object** — a fixed media element beside a flexible body
 * of content. Ubiquitous in social feeds, comments, notifications, and list
 * rows, but useful anywhere you need "thing on the side, text that fills the
 * rest". It is an unstyled layout primitive: no card, border, or background,
 * so it composes cleanly into any surface.
 *
 * The body uses `min-w-0` so long, unbroken content truncates/wraps correctly
 * instead of overflowing the row — the detail that makes the pattern robust.
 */
export const MediaObject = React.forwardRef<HTMLDivElement, MediaObjectProps>(
  (
    { media, thumbnail, side = 'left', align = 'start', gap = 3, actions, children, className, ...props },
    ref
  ) => {
    const figure = media ?? thumbnail;
    const mediaSlot = figure != null ? <div className="shrink-0">{figure}</div> : null;
    const body = <div className="min-w-0 flex-1">{children}</div>;

    return (
      <div ref={ref} className={cn('flex', alignClass[align], gapClass[gap], className)} {...props}>
        {side === 'left' && mediaSlot}
        {body}
        {side === 'right' && mediaSlot}
        {actions != null && <div className="shrink-0">{actions}</div>}
      </div>
    );
  }
);
MediaObject.displayName = 'MediaObject';

export default MediaObject;
