import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface TopicHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Topic title (h1). */
  title: React.ReactNode;
  /** Brand-colored deck under the title. */
  deck?: React.ReactNode;
  /** ISO date for the kicker `<time dateTime>`. */
  date?: string;
  /**
   * Series kicker + breadcrumb current segment (e.g. "Research 01").
   * Defaults to `"Research"` when omitted.
   */
  seriesLabel?: React.ReactNode;
  /** Optional lede under the deck. */
  lede?: React.ReactNode;
  /**
   * Breadcrumb home segment — host supplies the link element
   * (e.g. Next.js `<Link>` or `<a>`).
   */
  home: React.ReactNode;
  /** Accessible name for the breadcrumb nav. Default `"Breadcrumb"`. */
  breadcrumbLabel?: string;
}

const displayFace =
  'font-[family-name:var(--font-display,var(--blockquote-font-family,serif))]';

/**
 * Research topic page header: breadcrumb, series kicker, title, deck, lede.
 * Framework-agnostic — pass `home` as a ready-made link from the host app.
 */
export function TopicHeader({
  title,
  deck,
  date,
  seriesLabel = 'Research',
  lede,
  home,
  breadcrumbLabel = 'Breadcrumb',
  className,
  ...props
}: TopicHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-6', className)} {...props}>
      <nav aria-label={breadcrumbLabel}>
        <Text
          as="p"
          size="sm"
          tone="secondary"
          className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
        >
          <span className="font-medium text-[var(--text-color)] [&>a]:font-medium [&>a]:text-[var(--text-color)] [&>a]:underline-offset-2 [&>a]:transition-colors [&>a]:hover:text-[var(--brand-primary)] [&>a]:hover:underline">
            {home}
          </span>
          <span aria-hidden className="text-[var(--secondary-text-color)]">
            /
          </span>
          <span className="text-[var(--secondary-text-color)]">{seriesLabel}</span>
        </Text>
      </nav>

      <div className="flex flex-col gap-4 md:gap-5">
        <Text
          as="p"
          size="sm"
          tone="secondary"
          weight="medium"
          className="font-mono uppercase tracking-[0.14em]"
        >
          {seriesLabel}
          {date ? (
            <>
              {' · '}
              <time dateTime={date}>{date}</time>
            </>
          ) : null}
        </Text>

        <div className="flex flex-col gap-3.5 md:gap-4">
          <Text
            as="h1"
            size="4xl"
            weight="semibold"
            tone="strong"
            data-testid="topic-title"
            className={cn(
              displayFace,
              '!text-[clamp(1.75rem,4.6vw,2.65rem)] !leading-[1.12] !tracking-[-0.03em]',
            )}
          >
            {title}
          </Text>

          {deck != null && deck !== '' ? (
            <Text
              as="p"
              size="2xl"
              weight="medium"
              tone="brand"
              data-testid="topic-deck"
              className={cn(
                displayFace,
                'm-0 max-w-2xl !text-[clamp(1.15rem,3.2vw,1.65rem)] leading-snug tracking-[-0.01em] sm:tracking-[-0.02em]',
              )}
            >
              {deck}
            </Text>
          ) : null}
        </div>

        {lede != null && lede !== '' ? (
          <Text
            as="p"
            size="lg"
            tone="secondary"
            className="max-w-2xl leading-[1.75] text-pretty"
          >
            {lede}
          </Text>
        ) : null}
      </div>
    </header>
  );
}

export default TopicHeader;
