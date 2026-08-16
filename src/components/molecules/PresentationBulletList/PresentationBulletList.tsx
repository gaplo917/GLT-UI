import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationBulletListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  /** Bullet bodies (string or rich ReactNode). */
  items: readonly React.ReactNode[];
}

/**
 * Presentation-deck bullet list.
 * Gap between items is 1.5 line-heights; type is deck-readable at 13px.
 * Uses native list markers so the bullet is vertically centered on the first
 * line of multi-line items (browser list layout).
 */
export function PresentationBulletList({
  items,
  className,
  ...props
}: PresentationBulletListProps) {
  return (
    <ul
      className={cn(
        'm-0 flex list-outside list-disc flex-col gap-[1.5lh] py-0 pl-4 text-[13px] leading-[1.5] text-[var(--text-color)] marker:text-[var(--brand-primary)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--brand-primary)]',
        className,
      )}
      {...props}
    >
      {items.map((b, i) => (
        <li key={i} className="min-w-0 pl-0.5">
          {b}
        </li>
      ))}
    </ul>
  );
}

export default PresentationBulletList;
