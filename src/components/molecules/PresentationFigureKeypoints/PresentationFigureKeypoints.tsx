import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { PresentationBulletList } from '@/components/molecules/PresentationBulletList/PresentationBulletList.js';
import { PresentationDecisionCallout } from '@/components/molecules/PresentationDecisionCallout/PresentationDecisionCallout.js';

export type PresentationFigureCallout = {
  impact: React.ReactNode;
  takeaways: React.ReactNode;
  nextActions: React.ReactNode;
  impactLabel?: string;
  takeawaysLabel?: string;
  nextActionsLabel?: string;
};

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

function KeypointsBlock({
  bullets,
  callout,
  compact = false,
}: {
  bullets?: readonly React.ReactNode[];
  callout?: PresentationFigureCallout;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'grid min-h-0 shrink-0 grid-cols-[1.05fr_0.95fr] gap-2.5'
          : 'flex min-h-0 flex-col gap-1.5'
      }
    >
      {bullets ? <PresentationBulletList items={bullets} /> : null}
      {callout ? (
        <PresentationDecisionCallout
          impact={callout.impact}
          takeaways={callout.takeaways}
          nextActions={callout.nextActions}
          impactLabel={callout.impactLabel}
          takeawaysLabel={callout.takeawaysLabel}
          nextActionsLabel={callout.nextActionsLabel}
        />
      ) : null}
    </div>
  );
}

/**
 * Figure + keypoints layout for presentation decks.
 * Wide figures stack (figure top, keypoints below); taller/square figures use
 * a side-by-side column layout. Host supplies figure, bullets, and callout.
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
        <div className="flex min-h-0 min-w-0 flex-[1.15] flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-2">
          {caption ? (
            <p className="m-0 mb-1 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text-color)]">
              {caption}
            </p>
          ) : null}
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {/*
              Both axes constrained to the panel: width:100% + max-height:100% alone
              stretches width and clips the viewBox bottom under FitContain scale.
              height/width 100% + meet letterboxes the full SVG.
            */}
            <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center [&_.fld]:h-full [&_.fld]:w-full [&_.msb]:h-full [&_.msb]:w-full [&_.csd]:h-full [&_.csd]:w-full [&_.slf]:h-full [&_.slf]:w-full [&_.ahd]:h-full [&_.ahd]:w-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full">
              {figure}
            </div>
          </div>
        </div>
        <KeypointsBlock bullets={bullets} callout={callout} compact />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-3',
        className,
      )}
      {...props}
    >
      {/*
        minmax(0, …) is required: chart toolbars have long unbreakable chips;
        default min-width:auto expands the figure column and crushes keypoints
        under FitContain scale.
      */}
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-2">
        <div className="relative flex h-full min-h-0 min-w-0 w-full flex-1 items-center justify-center [&_.pdl]:h-full [&_.pdl]:w-full [&_.ecf]:h-full [&_.ecf]:w-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full">
          {figure}
        </div>
      </div>
      <div className="min-h-0 min-w-0">
        <KeypointsBlock bullets={bullets} callout={callout} />
      </div>
    </div>
  );
}

export default PresentationFigureKeypoints;
