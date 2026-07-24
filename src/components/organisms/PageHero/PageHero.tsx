import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Container } from '@/components/atoms/Container/Container.js';
import { Title } from '@/components/atoms/Title/Title.js';
import { Text } from '@/components/atoms/Text/Text.js';

export type PageHeroRailItem = {
  /** Optional mono index (e.g. "01"). */
  index?: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
};

export interface PageHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Overline / status chip row. */
  badge?: React.ReactNode;
  /** Primary headline (h1). May include accent spans. */
  title: React.ReactNode;
  /** Supporting paragraph under the title. */
  lead?: React.ReactNode;
  /** Primary actions (buttons / CTAs). */
  actions?: React.ReactNode;
  /** Meta next to actions (counts, status line). */
  meta?: React.ReactNode;
  /** Secondary line under the action row (legacy; still supported). */
  footnote?: React.ReactNode;
  /** Rail panel heading (right column on large screens). */
  railTitle?: React.ReactNode;
  /** Structured rail items. Ignored when `rail` is provided. */
  railItems?: readonly PageHeroRailItem[];
  /** Fully custom rail panel content (replaces railTitle + railItems). */
  rail?: React.ReactNode;
}

function RailListItem({ index, label, description }: PageHeroRailItem) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      {index != null && (
        <span className="font-mono text-xs text-[var(--brand-primary)] pt-0.5">{index}</span>
      )}
      <div className={cn('flex min-w-0 flex-col gap-1', index == null && 'col-span-2')}>
        <Text as="span" size="sm" weight="semibold" className="text-[var(--strong-text-color)]">
          {label}
        </Text>
        {description != null && (
          <Text as="span" size="sm" tone="secondary" className="leading-snug">
            {description}
          </Text>
        )}
      </div>
    </li>
  );
}

/**
 * Editorial page-opening hero: wash + grid backdrop, thesis column, optional
 * trust rail. Replaces the earlier single-column PageHero shell.
 */
export function PageHero({
  badge,
  title,
  lead,
  actions,
  meta,
  footnote,
  railTitle,
  railItems,
  rail,
  className,
  ...props
}: PageHeroProps) {
  const hasRail =
    rail != null || railTitle != null || (railItems != null && railItems.length > 0);

  const railPanel =
    rail ??
    (hasRail ? (
      <div className="glt-page-hero__rail rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)]/70 p-5 backdrop-blur-sm sm:p-6">
        {railTitle != null && (
          <Text
            as="p"
            size="xs"
            tone="secondary"
            weight="medium"
            className="mb-4 font-mono uppercase tracking-[0.16em]"
          >
            {railTitle}
          </Text>
        )}
        {railItems != null && railItems.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {railItems.map((item, i) => (
              <RailListItem
                key={i}
                index={item.index}
                label={item.label}
                description={item.description}
              />
            ))}
          </ul>
        )}
      </div>
    ) : null);

  return (
    <header
      className={cn(
        'glt-page-hero relative overflow-hidden border-b border-[var(--border-color)]',
        className
      )}
      {...props}
    >
      <div className="glt-page-hero__wash pointer-events-none absolute inset-0" aria-hidden />
      <div className="glt-page-hero__grid pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative py-14 sm:py-16 md:py-24">
        <div
          className={cn(
            'grid grid-cols-1 gap-12',
            hasRail && 'lg:grid-cols-12 lg:items-end lg:gap-10'
          )}
        >
          <div className={cn('flex flex-col gap-7', hasRail ? 'lg:col-span-8' : 'max-w-3xl')}>
            {badge != null && (
              <div className="flex flex-wrap items-center gap-3">{badge}</div>
            )}

            <div className="flex max-w-3xl flex-col gap-5">
              <Title
                as="h1"
                size={1}
                className={cn(
                  'glt-page-hero__title !text-[clamp(2.35rem,6.2vw,4.35rem)] !leading-[1.02] !tracking-[-0.035em] text-[var(--strong-text-color)]'
                )}
              >
                {title}
              </Title>

              {lead != null && (
                <Text
                  as="p"
                  size="xl"
                  tone="secondary"
                  className="max-w-2xl text-pretty leading-relaxed"
                >
                  {lead}
                </Text>
              )}
            </div>

            {(actions != null || meta != null) && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {actions}
                {meta}
              </div>
            )}

            {footnote != null && (
              <Text as="div" size="sm" tone="secondary" className="max-w-2xl">
                {footnote}
              </Text>
            )}
          </div>

          {hasRail && railPanel != null && (
            <aside className="lg:col-span-4">{railPanel}</aside>
          )}
        </div>
      </Container>
    </header>
  );
}

export default PageHero;
