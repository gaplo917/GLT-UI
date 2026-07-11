import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Content({ children, className }: ContentProps) {
  return <div className={cn('prose-research text-base leading-snug', className)}>{children}</div>;
}