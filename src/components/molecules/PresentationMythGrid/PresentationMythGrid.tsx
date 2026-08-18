import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { PresentationBulletList } from '@/components/molecules/PresentationBulletList/PresentationBulletList.js';

export type PresentationMythCard = {
  title: string;
  /** @deprecated Prefer `bullets`. Used as a single list item when bullets are omitted. */
  body?: string;
  bullets?: readonly React.ReactNode[];
};

export interface PresentationMythGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards shown in a 2-column (≤4) or 3-column (5–6) grid. */
  cards: readonly PresentationMythCard[];
}

/**
 * Two-column card grid for presentation myth / watch / open-question cards.
 * Host supplies titles and bullets. When the parent gives the grid a height,
 * rows stretch so 4–6 cards fill the board.
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
      {cards.map((c) => {
        const items =
          c.bullets && c.bullets.length > 0
            ? c.bullets
            : c.body
              ? [c.body]
              : [];
        return (
          <div
            key={c.title}
            className="flex min-h-0 flex-col rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/50 px-4 py-3.5"
          >
            <p className="m-0 text-[16px] font-bold leading-[1.15] text-[var(--strong-text-color)]">
              {c.title}
            </p>
            {items.length > 0 ? (
              <PresentationBulletList className="min-h-0" items={items} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default PresentationMythGrid;
