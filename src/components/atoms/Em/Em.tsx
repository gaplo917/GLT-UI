import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type EmProps = React.HTMLAttributes<HTMLElement>;

/**
 * Semantic stress / figure hinge numbers — token-aligned `<em>`.
 * Inherits surrounding colour so body and quote contexts stay coherent.
 */
export const Em = React.forwardRef<HTMLElement, EmProps>(
  ({ className, ...props }, ref) => (
    <em ref={ref} className={cn('italic text-inherit', className)} {...props} />
  )
);
Em.displayName = 'Em';

export default Em;
