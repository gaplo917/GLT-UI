import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * A page footer landmark. Lays its children out as a centered, wrapping row so
 * the copyright note and secondary links stay spaced apart (and stack cleanly
 * on mobile) instead of running together.
 */
export function SiteFooter({ children, className, ...props }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-[var(--border-color)] py-5 text-sm text-[var(--secondary-text-color)] sm:py-6',
        className
      )}
      {...props}
    >
      <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {children}
      </div>
    </footer>
  );
}

export default SiteFooter;
