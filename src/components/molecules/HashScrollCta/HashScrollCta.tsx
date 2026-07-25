'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface HashScrollCtaProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Element id to scroll to (without #). */
  targetId: string;
  /** Visible label / children. */
  children: React.ReactNode;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * In-page hash CTA: smooth-scrolls to `targetId` and syncs the URL hash.
 * Re-clicks re-scroll when already on that hash.
 */
export function HashScrollCta({
  targetId,
  children,
  className,
  onClick,
  ...props
}: HashScrollCtaProps) {
  const href = `#${targetId}`;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;

    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;

    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    el.scrollIntoView({ behavior, block: 'start' });

    if (window.location.hash !== href) {
      window.history.pushState(null, '', href);
    }
  }

  return (
    <a href={href} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </a>
  );
}

export default HashScrollCta;
