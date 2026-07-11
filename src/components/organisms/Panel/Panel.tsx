import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Text } from '../../atoms/Text/Text.js';

/**
 * A composable panel for compact controls and grouped lists. Assemble it from:
 * - `PanelHeading` — the title bar (first child)
 * - `PanelTabs` / `PanelTab` — in-panel navigation
 * - `PanelBlock` — a full-width row that can hold inputs, buttons, links, or a
 *   `<label>` with a checkbox; render it as a `div`, `a`, or `label`
 * - `PanelIcon` — a leading icon inside a block
 */
export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

export function Panel({ className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] shadow-sm',
        className
      )}
      {...props}
    />
  );
}

/** The panel's heading bar — use as the first child. */
export type PanelHeadingProps = React.HTMLAttributes<HTMLDivElement>;

export function PanelHeading({ className, ...props }: PanelHeadingProps) {
  return (
    <Text
      as="div"
      size="sm"
      weight="semibold"
      tone="strong"
      className={cn('bg-[var(--card-bg-color)] px-4 py-3', className)}
      {...props}
    />
  );
}

/** A row of in-panel navigation tabs. */
export type PanelTabsProps = React.HTMLAttributes<HTMLDivElement>;

export function PanelTabs({ className, ...props }: PanelTabsProps) {
  return (
    <div
      className={cn('flex items-center gap-4 border-t border-[var(--border-color)] px-4 text-sm', className)}
      {...props}
    />
  );
}

export interface PanelTabProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

/** A single tab within `PanelTabs` (renders as an anchor). */
export function PanelTab({ className, active = false, ...props }: PanelTabProps) {
  return (
    <a
      className={cn(
        'cursor-pointer border-b-2 py-2 transition-colors',
        active
          ? 'border-[var(--brand-primary)] font-medium text-[var(--strong-text-color)]'
          : 'border-transparent text-[var(--secondary-text-color)] hover:text-[var(--strong-text-color)]',
        className
      )}
      {...props}
    />
  );
}

/** A leading icon inside a `PanelBlock`. */
export type PanelIconProps = React.HTMLAttributes<HTMLSpanElement>;

export function PanelIcon({ className, ...props }: PanelIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex w-5 shrink-0 items-center justify-center text-[var(--secondary-text-color)]',
        className
      )}
      {...props}
    />
  );
}

export interface PanelBlockProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render as — a plain row, a link, or a label (for a checkbox). */
  as?: 'div' | 'a' | 'label';
  /** Highlight the block as the current/active selection. */
  active?: boolean;
  href?: string;
  htmlFor?: string;
}

/** A full-width panel row. Holds controls, links, labels, text — anything. */
export function PanelBlock({ as = 'div', active = false, className, ...props }: PanelBlockProps) {
  const interactive = as === 'a' || as === 'label';
  return React.createElement(as, {
    className: cn(
      'flex w-full items-center gap-2.5 border-t border-[var(--border-color)] px-4 py-2.5 text-sm text-[var(--text-color)]',
      interactive && 'cursor-pointer transition-colors hover:bg-[var(--card-bg-color)]',
      active && 'bg-[var(--brand-primary)]/[0.08] font-medium text-[var(--strong-text-color)]',
      className
    ),
    ...props,
  });
}

export default Panel;
