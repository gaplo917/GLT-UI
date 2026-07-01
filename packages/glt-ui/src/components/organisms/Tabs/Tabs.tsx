'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Button } from '../../atoms/Button/Button.js';
import { Icon } from '../../atoms/Icon/Icon.js';
import { Text } from '../../atoms/Text/Text.js';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Optional leading icon/glyph rendered before the label (via the Icon atom). */
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Lightweight controlled/uncontrolled tabs for research pages.
 * Uses brand colors for active state. Fully client interactive.
 */
export function Tabs({ items, defaultId, onChange, className }: TabsProps) {
  const [activeId, setActiveId] = React.useState(defaultId ?? items[0]?.id ?? '');

  const active = items.find((i) => i.id === activeId) ?? items[0];

  function select(id: string) {
    setActiveId(id);
    onChange?.(id);
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-2 mb-4">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <Button
              key={item.id}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => select(item.id)}
              className={cn('rounded-full px-4', isActive && 'shadow-sm')}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon != null && <Icon icon={item.icon} tone="inherit" />}
              <Text as="span" tone="inherit" weight="medium">
                {item.label}
              </Text>
            </Button>
          );
        })}
      </div>
      <div className="pt-1" key={activeId}>
        {active?.content}
      </div>
    </div>
  );
}

export default Tabs;
