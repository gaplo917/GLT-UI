'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Button } from '@/components/atoms/Button/Button.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Icon } from '@/components/atoms/Icon/Icon.js';

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  /** Optional leading icon/glyph. */
  icon?: React.ReactNode;
  /** Render in the danger tone (e.g. destructive actions). */
  danger?: boolean;
  disabled?: boolean;
  /** Per-item selection handler. */
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  triggerLabel: React.ReactNode;
  items: DropdownMenuItem[];
  defaultOpen?: boolean;
  /** Which edge the menu aligns to under the trigger. */
  align?: 'start' | 'end';
  /** Fired when any (enabled) item is chosen. */
  onSelect?: (item: DropdownMenuItem) => void;
  className?: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
    >
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A polished dropdown menu: a styled trigger with a rotating chevron and a
 * rounded, shadowed popover of actions. Supports item icons, danger/disabled
 * states, edge alignment, click-outside + Escape dismissal, and arrow-key
 * navigation.
 */
export function DropdownMenu({
  triggerLabel,
  items,
  defaultOpen = false,
  align = 'start',
  onSelect,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleSelect = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    setOpen(false);
    item.onSelect?.();
    onSelect?.(item);
    triggerRef.current?.focus();
  };

  const focusItem = (dir: 'next' | 'prev' | 'first' | 'last') => {
    const menu = menuRef.current;
    if (!menu) return;
    const nodes = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
    if (nodes.length === 0) return;
    const current = nodes.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (dir === 'first') next = 0;
    else if (dir === 'last') next = nodes.length - 1;
    else if (dir === 'next') next = current < 0 ? 0 : (current + 1) % nodes.length;
    else next = current <= 0 ? nodes.length - 1 : current - 1;
    nodes[next]?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem('next');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem('prev');
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem('last');
    }
  };

  return (
    <div ref={rootRef} className={cn('relative inline-block text-left', className)}>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && open) {
            e.preventDefault();
            focusItem('first');
          }
        }}
        className={cn(
          'h-auto gap-2 rounded-md border bg-[var(--bg-color)] px-3 py-1.5 text-sm font-medium text-[var(--text-color)]',
          'hover:translate-y-0 hover:bg-transparent hover:text-[var(--strong-text-color)]',
          open
            ? 'border-[var(--brand-primary)] text-[var(--strong-text-color)]'
            : 'border-[var(--border-color)] hover:border-[var(--brand-primary)]'
        )}
      >
        <Text as="span" size="sm" tone="inherit" truncate className="min-w-0">
          {triggerLabel}
        </Text>
        <Chevron open={open} />
      </Button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute z-20 mt-1.5 min-w-[12rem] origin-top rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] p-1.5 shadow-lg',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              role="menuitem"
              variant="ghost"
              size="sm"
              disabled={item.disabled}
              onClick={() => handleSelect(item)}
              className={cn(
                'h-auto w-full justify-start gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm font-normal hover:translate-y-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                item.disabled
                  ? 'cursor-not-allowed opacity-45'
                  : item.danger
                    ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 focus-visible:bg-[var(--color-danger)]/10'
                    : 'text-[var(--text-color)] hover:bg-[var(--card-bg-color)] hover:text-[var(--strong-text-color)] focus-visible:bg-[var(--card-bg-color)] focus-visible:text-[var(--strong-text-color)]'
              )}
            >
              {item.icon != null && (
                <Icon icon={item.icon} tone="secondary" className="w-4 shrink-0" />
              )}
              <Text as="span" size="sm" tone="inherit" truncate className="min-w-0 flex-1">
                {item.label}
              </Text>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
