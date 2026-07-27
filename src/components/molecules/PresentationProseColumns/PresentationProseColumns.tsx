import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { PresentationBulletList } from '@/components/molecules/PresentationBulletList/PresentationBulletList.js';
import {
  PresentationDecisionCallout,
  type PresentationDecisionCalloutProps,
} from '@/components/molecules/PresentationDecisionCallout/PresentationDecisionCallout.js';

export type PresentationProseCallout = Pick<
  PresentationDecisionCalloutProps,
  | 'impact'
  | 'takeaways'
  | 'nextActions'
  | 'impactLabel'
  | 'takeawaysLabel'
  | 'nextActionsLabel'
>;

export interface PresentationProseColumnsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Left column: key bullets (shorter line length for board reading). */
  bullets?: readonly React.ReactNode[];
  /** Right column: impact / takeaways / next actions. */
  callout?: PresentationProseCallout;
  /**
   * Optional block under the left column (e.g. close-slide myth cards).
   * Keeps callout on the right for scanability.
   */
  leftExtra?: React.ReactNode;
  /**
   * When true, stack bullets above callout (narrow side rail next to a figure).
   * Default false: left-right two columns for shorter reading lines.
   */
  stack?: boolean;
}

/**
 * Presentation prose for executive decks.
 * Default: bullets left, decision callout right (shorter lines).
 * stack: vertical when the host already places this in a narrow column.
 */
export function PresentationProseColumns({
  bullets,
  callout,
  leftExtra,
  stack = false,
  className,
  ...props
}: PresentationProseColumnsProps) {
  const hasLeft = (bullets != null && bullets.length > 0) || leftExtra != null;
  const hasRight = callout != null;

  if (!hasLeft && !hasRight) return null;

  if (stack || !hasLeft || !hasRight) {
    return (
      <div
        className={cn('flex min-h-0 min-w-0 flex-col gap-2.5', className)}
        {...props}
      >
        {bullets != null && bullets.length > 0 ? (
          <PresentationBulletList items={bullets} />
        ) : null}
        {leftExtra}
        {callout != null ? <PresentationDecisionCallout {...callout} /> : null}
      </div>
    );
  }

  return (
    <div
      className={cn('grid min-h-0 min-w-0 flex-1 grid-cols-2 gap-3', className)}
      {...props}
    >
      <div className="flex min-h-0 min-w-0 flex-col gap-2">
        {bullets != null && bullets.length > 0 ? (
          <PresentationBulletList items={bullets} />
        ) : null}
        {leftExtra}
      </div>
      <div className="min-h-0 min-w-0 border-l border-[var(--border-color)] pl-3">
        <PresentationDecisionCallout {...callout} />
      </div>
    </div>
  );
}

export default PresentationProseColumns;
