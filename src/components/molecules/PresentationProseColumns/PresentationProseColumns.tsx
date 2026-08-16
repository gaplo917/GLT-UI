import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { PresentationBulletList } from '@/components/molecules/PresentationBulletList/PresentationBulletList.js';

export interface PresentationProseColumnsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Key bullets (full width; shorter line length comes from the host frame). */
  bullets?: readonly React.ReactNode[];
  /**
   * Optional block under the bullets (e.g. close-slide myth cards).
   */
  leftExtra?: React.ReactNode;
}

/**
 * Presentation prose for executive decks: a bullet list and optional extra block.
 */
export function PresentationProseColumns({
  bullets,
  leftExtra,
  className,
  ...props
}: PresentationProseColumnsProps) {
  const hasBullets = bullets != null && bullets.length > 0;
  if (!hasBullets && leftExtra == null) return null;

  return (
    <div
      className={cn('flex min-h-0 min-w-0 flex-col gap-2.5', className)}
      {...props}
    >
      {hasBullets ? <PresentationBulletList items={bullets} /> : null}
      {leftExtra}
    </div>
  );
}

export default PresentationProseColumns;
