import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface FigureObservationProps extends React.HTMLAttributes<HTMLElement> {
  /** Eyebrow label above the body. Defaults to "Observation". */
  label?: string;
  children: React.ReactNode;
}

/**
 * Closing takeaway under a chart/visual (above optional source tables).
 * Use for trend → thesis evidence copy — not a datapoint walkthrough.
 */
export function FigureObservation({
  label = 'Observation',
  children,
  className,
  ...props
}: FigureObservationProps) {
  return (
    <aside
      className={cn(
        'mt-5 rounded-[var(--radius-card)] border border-[var(--border-color)]',
        'bg-[var(--bg-color)]/50 px-3 py-3 sm:px-4 sm:py-3.5',
        className,
      )}
      {...props}
    >
      <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
        {label}
      </p>
      <div className="mt-1.5 space-y-2.5 text-sm leading-relaxed text-[var(--text-color)] [&_p]:m-0 [&_p]:leading-relaxed">
        {children}
      </div>
    </aside>
  );
}

export default FigureObservation;
