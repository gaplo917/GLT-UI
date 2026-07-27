import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationBulletListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  /** Bullet bodies (string or rich ReactNode). */
  items: readonly React.ReactNode[];
}

/**
 * Compact presentation-deck bullet list: brand-dot markers, snug type.
 * Content-agnostic — host supplies every item.
 */
export function PresentationBulletList({
  items,
  className,
  ...props
}: PresentationBulletListProps) {
  return (
    <ul
      className={cn('m-0 flex list-none flex-col gap-1.5 p-0', className)}
      {...props}
    >
      {items.map((b, i) => (
        <li
          key={i}
          className="flex gap-1.5 text-[11px] leading-[1.45] text-[var(--text-color)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--brand-primary)]"
        >
          <span
            className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--brand-primary)]"
            aria-hidden
          />
          <span className="min-w-0">{b}</span>
        </li>
      ))}
    </ul>
  );
}

export default PresentationBulletList;
