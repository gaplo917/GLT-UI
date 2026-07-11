import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type ProgressBarIntent = 'brand' | 'info' | 'success' | 'warning' | 'danger';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  label?: React.ReactNode;
  value: number;
  suffix?: string;
  max?: number;
  intent?: ProgressBarIntent;
  size?: ProgressBarSize;
  showValue?: boolean;
  className?: string;
}

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const intentColors: Record<ProgressBarIntent, string> = {
  brand: 'bg-[var(--brand-primary)]',
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
};

export function ProgressBar({
  label,
  value,
  suffix = '',
  max = 100,
  intent = 'brand',
  size = 'md',
  showValue = true,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={className}>
      {(label != null || showValue) && (
        <div className="text-base mb-0.5">
          {label}
          {label != null && showValue ? ': ' : ''}
          {showValue ? (
            <>
              {value}
              {suffix}
            </>
          ) : null}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('mt-1 rounded-full bg-[var(--border-color)]', sizeClasses[size])}
      >
        <div
          className={cn('rounded-full', sizeClasses[size], intentColors[intent])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
