import * as React from 'react';
import { cn } from '@/lib/cn.js';

export interface PresentationSlideFrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Uppercase kicker above the title (e.g. "02 · Thesis"). */
  kicker?: React.ReactNode;
  /** Slide title in the header band. */
  title?: React.ReactNode;
  /**
   * Optional brand / meta block in the header (host-supplied).
   * Empty by default — no product defaults.
   */
  brandMeta?: React.ReactNode;
  /** When true, omit the header band (title-page layouts). */
  hideHeader?: boolean;
  /** Natural board width. Default 960. */
  naturalW?: number;
  /** Natural board height. Default 540. */
  naturalH?: number;
  /** Body content. */
  children?: React.ReactNode;
  /** data-presentation-slide value (optional host id). */
  slideId?: string;
  /** data-presentation-num value (optional deck number). */
  slideNum?: string;
}

/**
 * Presentation board chrome only: fixed natural size, optional header kicker /
 * title / brand meta, children for body. Host supplies all copy and content.
 */
export function PresentationSlideFrame({
  kicker,
  title,
  brandMeta,
  hideHeader = false,
  naturalW = 960,
  naturalH = 540,
  children,
  className,
  slideId,
  slideNum,
  style,
  ...props
}: PresentationSlideFrameProps) {
  const showHeader = !hideHeader && (kicker != null || title != null || brandMeta != null);

  return (
    <article
      data-presentation-slide={slideId}
      data-presentation-num={slideNum}
      className={cn(
        'box-border flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)] shadow-sm',
        className,
      )}
      style={{
        width: naturalW,
        height: naturalH,
        maxWidth: naturalW,
        ...style,
      }}
      {...props}
    >
      {showHeader ? (
        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pb-1 pt-4">
          <div className="min-w-0">
            {kicker != null && (
              <p
                className="m-0 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--brand-primary)]"
                style={{
                  fontFamily: 'var(--font-body, var(--font-family), system-ui, sans-serif)',
                }}
              >
                {kicker}
              </p>
            )}
            {title != null && (
              <h2
                className="m-0 mt-1 text-[22px] font-normal leading-[1.2] tracking-tight text-[var(--strong-text-color)]"
                style={{
                  fontFamily:
                    'var(--font-display, "Times New Roman", serif)',
                }}
              >
                {title}
              </h2>
            )}
          </div>
          {brandMeta != null && (
            <div
              className="m-0 shrink-0 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--brand-primary)]"
              style={{
                fontFamily: 'var(--font-body, var(--font-family), system-ui, sans-serif)',
              }}
            >
              {brandMeta}
            </div>
          )}
        </header>
      ) : null}

      <div
        className={
          showHeader
            ? 'flex min-h-0 flex-1 flex-col gap-1.5 px-5 py-2'
            : 'flex min-h-0 flex-1 flex-col'
        }
      >
        {children}
      </div>
    </article>
  );
}

export default PresentationSlideFrame;
