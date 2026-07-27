import * as React from 'react';
import { cn } from '@/lib/cn.js';
import {
  PresentationProseColumns,
  type PresentationProseCallout,
} from '@/components/molecules/PresentationProseColumns/PresentationProseColumns.js';

export type PresentationFigureCallout = PresentationProseCallout;

export interface PresentationFigureKeypointsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When true, stack figure above keypoints (wide / landscape figures).
   * When false, side-by-side figure + keypoints columns.
   */
  wide: boolean;
  /** Chart / diagram node (host-supplied). */
  figure: React.ReactNode;
  /** Optional key bullets beside or below the figure. */
  bullets?: readonly React.ReactNode[];
  /** Optional impact / takeaways / next-actions block. */
  callout?: PresentationFigureCallout;
  /** Optional caption above the figure (wide layout only). */
  caption?: string;
}

/**
 * Figure + keypoints layout for presentation decks.
 * Wide: figure on top, two-column prose under (bullets | impact rows).
 * Side: figure left, stacked prose right (column already short for reading).
 */
export function PresentationFigureKeypoints({
  wide,
  figure,
  bullets,
  callout,
  caption,
  className,
  ...props
}: PresentationFigureKeypointsProps) {
  if (wide) {
    return (
      <div
        className={cn('flex min-h-0 min-w-0 flex-1 flex-col gap-2', className)}
        {...props}
      >
        {/* Fixed cap keeps figure-wide boards readable: prose needs room for 3 bullets + 3 callout rows. */}
        <div className="flex h-[140px] max-h-[140px] min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-1.5">
          {caption ? (
            <p className="m-0 mb-1 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text-color)]">
              {caption}
            </p>
          ) : null}
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center [&_.fld]:h-full [&_.fld]:w-full [&_.msb]:h-full [&_.msb]:w-full [&_.csd]:h-full [&_.csd]:w-full [&_.slf]:h-full [&_.slf]:w-full [&_.ahd]:h-full [&_.ahd]:w-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full">
              {figure}
            </div>
          </div>
        </div>
        <PresentationProseColumns
          className="min-h-0 min-w-0 flex-1"
          bullets={bullets}
          callout={callout}
        />
      </div>
    );
  }

  // Figure left; prose as bullets | callout on the right for short reading lines.
  return (
    <div
      className={cn(
        'grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3',
        className,
      )}
      {...props}
    >
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-2">
        <div className="relative flex h-full min-h-0 min-w-0 w-full flex-1 items-center justify-center [&_.pdl]:h-full [&_.pdl]:w-full [&_.ecf]:h-full [&_.ecf]:w-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full">
          {figure}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <PresentationProseColumns
          className="min-h-0 flex-1"
          bullets={bullets}
          callout={callout}
        />
      </div>
    </div>
  );
}

export default PresentationFigureKeypoints;
