'use client';

import * as React from 'react';
import { Surface } from '@/components/atoms/Surface/Surface.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Badge } from '@/components/atoms/Badge/Badge.js';

export interface DataHighlightProps {
  value: string | number;
  label: string;
  /** Prefix e.g. "+" or "$" */
  prefix?: string;
  suffix?: string;
  /** Small change indicator */
  change?: string;
  className?: string;
}

/**
 * Large stat callout used for key research metrics (productivity %, cost deltas).
 * Composes the Surface, Text, and Badge atoms; drives brand primary on numbers.
 */
export function DataHighlight({ value, label, prefix = '', suffix = '', change, className }: DataHighlightProps) {
  return (
    <Surface tone="card" bordered radius="xl" padding="lg" className={className}>
      <Text as="div" size="5xl" weight="semibold" tone="brand" className="tabular-nums tracking-[-1px]">
        {prefix}{value}{suffix}
      </Text>
      <Text as="div" size="base" tone="secondary" className="mt-1 flex items-baseline gap-2">
        {label}
        {change && <Badge variant="fact" size="sm">{change}</Badge>}
      </Text>
    </Surface>
  );
}

export default DataHighlight;
