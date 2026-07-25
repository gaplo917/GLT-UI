import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type PresentationMythCard = {
  title: string;
  body: string;
};

export interface PresentationMythGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards shown in a 2-column myth / watch grid. */
  cards: readonly PresentationMythCard[];
}

/**
 * Two-column card grid for presentation close slides (myths, watch items, debt).
 * Host supplies all titles and bodies.
 */
export function PresentationMythGrid({
  cards,
  className,
  ...props
}: PresentationMythGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)} {...props}>
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/50 px-3 py-2"
        >
          <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-[var(--brand-primary)]">
            {c.title}
          </p>
          <p className="m-0 mt-0.5 text-[12px] leading-snug text-[var(--text-color)]">
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PresentationMythGrid;
