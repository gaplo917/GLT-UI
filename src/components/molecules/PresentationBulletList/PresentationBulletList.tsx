import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationBulletListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  /** Bullet bodies (string or rich ReactNode). */
  items: readonly React.ReactNode[];
}

/**
 * Compact presentation-deck bullet list.
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
        'm-0 list-outside list-disc space-y-1.5 py-0 pl-4 text-[11px] leading-[1.45] text-[var(--text-color)] marker:text-[var(--brand-primary)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--brand-primary)]',
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
