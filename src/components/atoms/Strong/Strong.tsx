import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type StrongProps = React.HTMLAttributes<HTMLElement>;

/**
 * Semantic emphasis — token-aligned `<strong>` for claim spines and key terms.
 * Prefer over ad-hoc `font-semibold` on raw markup.
 */
export const Strong = React.forwardRef<HTMLElement, StrongProps>(
  ({ className, ...props }, ref) => (
    <strong
      ref={ref}
      className={cn('font-semibold text-[var(--strong-text-color)]', className)}
      {...props}
    />
  )
);
Strong.displayName = 'Strong';

export default Strong;
