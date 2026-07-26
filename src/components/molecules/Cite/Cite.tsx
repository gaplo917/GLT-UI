import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface CiteProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** External (or in-page) destination. Opens in a new tab by default. */
  href: string;
  children: React.ReactNode;
  /**
   * When true (default), sets `target="_blank"` and `rel="noreferrer"`.
   * Set false for same-tab navigation.
   */
  external?: boolean;
}

/**
 * In-prose external citation link (underlined brand). Distinct from `RefCite`,
 * which renders bibliography `[n]` markers with tooltips.
 */
export function Cite({
  href,
  children,
  className,
  external = true,
  target,
  rel,
  ...props
}: CiteProps) {
  return (
    <a
      href={href}
      target={external ? target ?? '_blank' : target}
      rel={external ? rel ?? 'noreferrer' : rel}
      className={cn(
        'underline underline-offset-2 text-[var(--brand-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export default Cite;
