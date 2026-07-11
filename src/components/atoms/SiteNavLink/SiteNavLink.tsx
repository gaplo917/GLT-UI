import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type SiteNavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function SiteNavLink({ className, children, ...props }: SiteNavLinkProps) {
  return (
    <a
      className={cn(
        'text-[var(--secondary-text-color)] hover:text-[var(--brand-primary)] transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export default SiteNavLink;