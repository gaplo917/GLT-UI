import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Vertical gap between stacked blocks (`space-y-*`).
   * Default `5` matches research essay rhythm.
   */
  gap?: 3 | 4 | 5 | 6 | 8;
}

const gapClass: Record<NonNullable<ProseProps['gap']>, string> = {
  3: 'space-y-3',
  4: 'space-y-4',
  5: 'space-y-5',
  6: 'space-y-6',
  8: 'space-y-8',
};

/**
 * Vertical stack for essay body blocks (`P`, callouts, lists). Fixed research
 * rhythm; host supplies all copy.
 */
export function Prose({
  children,
  className,
  gap = 5,
  ...props
}: ProseProps) {
  return (
    <div className={cn(gapClass[gap], className)} {...props}>
      {children}
    </div>
  );
}

export default Prose;
