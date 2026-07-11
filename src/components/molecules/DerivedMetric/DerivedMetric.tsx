import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface DerivedMetricProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DerivedMetric({ label, value, className }: DerivedMetricProps) {
  return (
    <div className={cn('pt-2 border-t border-[var(--border-color)]', className)}>
      <Text as="div" size="base" tone="secondary" className="uppercase tracking-widest mb-1">
        {label}
      </Text>
      <Text as="div" size="6xl" weight="semibold" tone="brand" className="tabular-nums">{value}</Text>
    </div>
  );
}

export default DerivedMetric;