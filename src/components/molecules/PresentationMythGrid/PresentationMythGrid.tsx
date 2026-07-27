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
 * Two-column card grid for presentation myth / watch / debt cards.
 * Host supplies all titles and bodies.
 */
export function PresentationMythGrid({
  cards,
  className,
  ...props
}: PresentationMythGridProps) {
  return (
    <div
      className={cn(
        'grid min-h-0 grid-cols-2 content-start gap-2',
        className,
      )}
      {...props}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex min-h-0 flex-col rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/50 px-3 py-2.5"
        >
          <p className="m-0 text-[6.5px] font-semibold uppercase tracking-[0.1em] text-[var(--brand-primary)]">
            {c.title}
          </p>
          <p className="m-0 mt-1 text-[7.5px] leading-[1.45] text-[var(--text-color)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)]">
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PresentationMythGrid;
