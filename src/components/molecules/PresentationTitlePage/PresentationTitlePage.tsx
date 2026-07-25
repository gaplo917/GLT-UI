import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationTitlePageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Uppercase kicker above the title (e.g. "01 · Research 01"). */
  kicker: React.ReactNode;
  /** Main title line. */
  title: React.ReactNode;
  /** Optional credit line (author / brand). */
  credit?: React.ReactNode;
  /** Optional secondary credit detail under credit. */
  creditDetail?: React.ReactNode;
}

/**
 * Centered presentation title-page body. Host supplies kicker, title, and
 * optional credit lines — no product defaults.
 */
export function PresentationTitlePage({
  kicker,
  title,
  credit,
  creditDetail,
  className,
  ...props
}: PresentationTitlePageProps) {
  const showCredit = credit != null || creditDetail != null;

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col items-center justify-center px-10 text-center',
        className,
      )}
      {...props}
    >
      <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
        {kicker}
      </p>
      <h2 className="m-0 mt-5 max-w-[34rem] text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--strong-text-color)]">
        {title}
      </h2>
      {showCredit ? (
        <div className="mt-10 flex flex-col items-center gap-2">
          {credit != null ? (
            <p className="m-0 text-[15px] font-medium text-[var(--strong-text-color)]">
              {credit}
            </p>
          ) : null}
          {creditDetail != null ? (
            <p className="m-0 text-[12px] tracking-wide text-[var(--secondary-text-color)]">
              {creditDetail}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default PresentationTitlePage;
