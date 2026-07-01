'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Button } from '../../atoms/Button/Button.js';
import { Text } from '../../atoms/Text/Text.js';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
}

/**
 * Controlled state accordion for dense research content (techniques, sources).
 * Header rows compose the Button atom; titles and bodies compose the Text atom.
 */
export function Accordion({ items, defaultOpen = [], multiple = false, className }: AccordionProps) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen);

  function toggle(id: string) {
    if (multiple) {
      setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setOpen((prev) => (prev.includes(id) ? [] : [id]));
    }
  }

  return (
    <div className={cn('divide-y divide-[var(--border-color)] rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)] overflow-hidden', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${item.id}`}
              className={cn(
                'h-auto justify-between rounded-none px-5 py-3.5 text-left font-medium hover:translate-y-0 hover:bg-[var(--bg-color)] focus-visible:ring-1 focus-visible:ring-offset-0',
                isOpen ? 'bg-[var(--bg-color)] text-[var(--brand-primary)]' : 'text-[var(--text-color)]'
              )}
            >
              <Text as="span" tone="inherit" weight="medium">
                {item.title}
              </Text>
              <Text
                as="span"
                tone="inherit"
                aria-hidden="true"
                className={cn('select-none text-2xl leading-none transition-transform', isOpen && 'rotate-180')}
              >
                ⌄
              </Text>
            </Button>
            <div
              id={`acc-panel-${item.id}`}
              role="region"
              className={cn(
                'grid bg-[var(--bg-color)] transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <Text
                  as="div"
                  size="base"
                  aria-hidden={!isOpen}
                  className={cn(
                    'px-5 pb-5 pt-1 transition-opacity duration-300 motion-reduce:transition-none',
                    isOpen ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {item.content}
                </Text>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
