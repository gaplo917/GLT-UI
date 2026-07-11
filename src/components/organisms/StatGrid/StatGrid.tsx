import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colMap = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function StatGrid({ children, columns = 3, className }: StatGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', colMap[columns], className)}>
      {children}
    </div>
  );
}

export default StatGrid;