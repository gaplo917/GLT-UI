import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationDecisionCalloutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** First row body (default label: Impact). */
  impact: React.ReactNode;
  /** Second row body (default label: Takeaways). */
  takeaways: React.ReactNode;
  /** Third row body (default label: Next actions). */
  nextActions: React.ReactNode;
  /** Overline for the impact row. Default "Impact". */
  impactLabel?: string;
  /** Overline for the takeaways row. Default "Takeaways". */
  takeawaysLabel?: string;
  /** Overline for the next-actions row. Default "Next actions". */
  nextActionsLabel?: string;
}

/**
 * Impact · takeaways · next actions for presentation decks.
 * Labels stay small; body is ~40% smaller than the prior 11.5px scale (~7px).
 */
export function PresentationDecisionCallout({
  impact,
  takeaways,
  nextActions,
  impactLabel = 'Impact',
  takeawaysLabel = 'Takeaways',
  nextActionsLabel = 'Next actions',
  className,
  ...props
}: PresentationDecisionCalloutProps) {
  const rows = [
    { key: impactLabel, body: impact },
    { key: takeawaysLabel, body: takeaways },
    { key: nextActionsLabel, body: nextActions },
  ] as const;

  return (
    <div className={cn('min-w-0 py-0.5', className)} {...props}>
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.key} className="min-w-0">
            <p className="m-0 text-[6px] font-semibold uppercase tracking-[0.1em] text-[var(--brand-primary)]">
              {row.key}
            </p>
            <p className="m-0 mt-0.5 text-[7px] leading-[1.4] text-[var(--text-color)] [&_strong]:font-semibold [&_strong]:text-[var(--strong-text-color)] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[var(--brand-primary)]">
              {row.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PresentationDecisionCallout;
