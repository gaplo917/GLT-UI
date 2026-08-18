import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type PresentationMythCard = {
  title: string;
  body: string;
};

export interface PresentationMythGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards shown in a 2-column (≤4) or 3-column (5–6) grid. */
  cards: readonly PresentationMythCard[];
}

/**
 * Two-column card grid for presentation myth / watch / open-question cards.
 * Host supplies all titles and bodies. When the parent gives the grid a
 * height (flex-1), rows stretch so 4–6 cards fill the board.
 */
export function PresentationMythGrid({
  cards,
  className,
  style,
  ...props
}: PresentationMythGridProps) {
  const columns = cards.length >= 5 ? 3 : 2;
  const rows = Math.max(1, Math.ceil(cards.length / columns));

  return (
    <div
      className={cn(
        'grid h-full min-h-0 gap-3',
        columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
        className,
      )}
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex min-h-0 flex-col rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/50 px-4 py-3.5"
        >
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            {c.title}
          </p>
          <p className="m-0 mt-2 text-[16px] leading-[1.35] text-[var(--text-color)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)]">
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PresentationMythGrid;
