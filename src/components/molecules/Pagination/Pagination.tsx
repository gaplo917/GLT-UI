'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button/Button.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface PaginationProps {
  pages: number[];
  suffix?: React.ReactNode;
  defaultPage?: number;
}

/** A row of page controls, composed from the Button and Text atoms. */
export function Pagination({ pages, suffix, defaultPage = 1 }: PaginationProps) {
  const [selected, setSelected] = React.useState(defaultPage);

  return (
    <div className="flex items-center gap-1">
      {pages.map((p) => (
        <Button
          key={p}
          size="xs"
          variant={selected === p ? 'primary' : 'ghost'}
          className={selected === p ? undefined : 'border-[var(--border-color)]'}
          onClick={() => setSelected(p)}
        >
          {p}
        </Button>
      ))}
      {suffix != null && (
        <Text as="span" size="base" tone="secondary" className="ml-1">
          {suffix}
        </Text>
      )}
    </div>
  );
}

export default Pagination;
