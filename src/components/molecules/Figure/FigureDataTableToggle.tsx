'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface FigureDataTableToggleProps {
  /** Summary row label. */
  label?: string;
  /** Optional helper under the summary when open. */
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsed-by-default disclosure for figure data tables / source rows.
 */
export function FigureDataTableToggle({
  label = 'Data table and sources',
  hint = 'Full row metrics and source notes for the figure above.',
  children,
  className,
}: FigureDataTableToggleProps) {
  return (
    <details
      className={cn(
        'group mt-4 rounded-[var(--radius-card)] border border-[var(--border-color)]',
        'bg-[var(--card-bg-color)]/40 open:bg-[var(--card-bg-color)]/60',
        className,
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-3',
          'px-3 py-2.5 text-sm font-medium text-[var(--text-color)]',
          'marker:content-none [&::-webkit-details-marker]:hidden',
          'hover:bg-[var(--bg-color)]/35',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-primary)]',
        )}
      >
        <span className="min-w-0">{label}</span>
        <span
          className={cn(
            'shrink-0 text-xs font-medium uppercase tracking-wide',
            'text-[var(--secondary-text-color)]',
            "after:ml-1 after:inline-block after:transition-transform",
            "after:content-['▸'] group-open:after:rotate-90",
          )}
          aria-hidden
        >
          <span className="group-open:hidden">Show</span>
          <span className="hidden group-open:inline">Hide</span>
        </span>
      </summary>
      <div className="border-t border-[var(--border-color)] px-3 py-3 sm:px-4 sm:py-4">
        {hint ? (
          <Text as="p" size="sm" tone="secondary" className="mb-3 leading-relaxed">
            {hint}
          </Text>
        ) : null}
        {children}
      </div>
    </details>
  );
}

export default FigureDataTableToggle;
