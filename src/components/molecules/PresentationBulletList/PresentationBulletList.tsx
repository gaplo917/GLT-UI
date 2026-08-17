import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationBulletListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  /** Bullet bodies (string or rich ReactNode). */
  items: readonly React.ReactNode[];
}

/**
 * Presentation-deck bullet list.
 * 16px type at 1.15 line-height; first item 0.6lh top margin, later items 1.2lh.
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
        'm-0 list-outside list-disc py-0 pl-5 text-[16px] leading-[1.15] text-[var(--text-color)] marker:text-[var(--brand-primary)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--brand-primary)]',
        className,
      )}
      {...props}
    >
      {items.map((b, i) => (
        <li
          key={i}
          className={cn('min-w-0 pl-0.5', i === 0 ? 'mt-[0.6lh]' : 'mt-[1.2lh]')}
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

export default PresentationBulletList;
