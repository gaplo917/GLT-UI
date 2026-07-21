import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface FullBleedFigureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Primary figure title (e.g. "Figure 2 · …"). */
  title: React.ReactNode;
  /** Supporting caption under the title. */
  caption?: React.ReactNode;
  /** Max width of the framed figure (default 1000px). */
  maxWidth?: number | string;
  /** Visual / chart / table content. */
  children: React.ReactNode;
}

/**
 * Full-bleed research figure: breaks out of a narrow prose column so charts
 * and tables can use more width, with a top title/caption chrome.
 *
 * Place inside a max-width prose column; the shell centers with `100vw` pull.
 */
export function FullBleedFigure({
  title,
  caption,
  maxWidth = 1000,
  children,
  className,
  ...props
}: FullBleedFigureProps) {
  const max =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <div
      className={cn(
        'relative w-[100vw] max-w-[100vw] left-1/2 -translate-x-1/2 self-stretch px-2.5 sm:px-4',
        className,
      )}
    >
      <figure
        className={[
          'mx-auto w-full my-4 rounded-[var(--radius-card)] border border-[var(--border-color)]',
          'bg-[var(--card-bg-color)]/50 px-3.5 py-5 shadow-sm sm:px-5 sm:py-6 md:px-8 md:py-8',
        ].join(' ')}
        style={{ maxWidth: max }}
        {...props}
      >
        <figcaption className="mb-5 max-w-3xl">
          <Text
            as="div"
            size="lg"
            weight="semibold"
            className="mb-1.5 tracking-tight text-[var(--text-color)]"
          >
            {title}
          </Text>
          {caption != null ? (
            <Text
              as="div"
              size="lg"
              tone="secondary"
              className="leading-[1.75] text-pretty"
            >
              {caption}
            </Text>
          ) : null}
        </figcaption>
        <div className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain">
          {children}
        </div>
      </figure>
    </div>
  );
}

export default FullBleedFigure;
