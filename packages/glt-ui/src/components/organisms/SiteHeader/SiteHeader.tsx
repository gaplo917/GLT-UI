import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Container } from '../../atoms/Container/Container.js';

export interface SiteHeaderProps {
  brand: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function SiteHeader({ brand, actions, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-color)]/95 backdrop-blur',
        className
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        {brand}
        {actions != null && (
          <div className="flex items-center gap-3 text-base">{actions}</div>
        )}
      </Container>
    </header>
  );
}

export default SiteHeader;