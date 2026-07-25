import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Badge } from '@/components/atoms/Badge/Badge.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Title } from '@/components/atoms/Title/Title.js';
import { Card, CardContent } from '@/components/organisms/Card/Card.js';

export type CatalogItem = {
  /** Stable id (slug or key). */
  id: string;
  href: string;
  title: React.ReactNode;
  summary?: React.ReactNode;
  date?: string;
  status?: string;
  tags?: readonly string[];
};

export type CatalogLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  'data-catalog-id'?: string;
  'data-catalog-href'?: string;
};

export interface CatalogListProps extends React.HTMLAttributes<HTMLOListElement> {
  items: readonly CatalogItem[];
  /** Empty-state copy when items is empty. */
  emptyMessage?: React.ReactNode;
  /** CTA label on each card (defaults to "Read more"). */
  ctaLabel?: React.ReactNode;
  /**
   * Optional link renderer (e.g. Next.js Link). Defaults to a plain `<a>`.
   * Must render an interactive element that accepts href + className + children.
   */
  renderLink?: (props: CatalogLinkProps) => React.ReactNode;
  /** Max tags shown per card. */
  maxTags?: number;
}

function DefaultLink({ href, className, children, ...rest }: CatalogLinkProps) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

function CatalogCard({
  item,
  index,
  ctaLabel,
  maxTags,
  renderLink,
}: {
  item: CatalogItem;
  index: number;
  ctaLabel: React.ReactNode;
  maxTags: number;
  renderLink: (props: CatalogLinkProps) => React.ReactNode;
}) {
  const indexLabel = String(index).padStart(2, '0');
  const tags = item.tags?.slice(0, maxTags) ?? [];

  return (
    <>
      {renderLink({
        href: item.href,
        className:
          'catalog-card group block no-underline text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-primary)]',
        'data-catalog-id': item.id,
        'data-catalog-href': item.href,
        children: (
          <Card className="catalog-card__surface relative overflow-hidden border-[var(--border-color)] bg-[var(--card-bg-color)] transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:border-[var(--brand-primary)] group-hover:shadow-[var(--box-shadow)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[var(--brand-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
              aria-hidden
            />
            <CardContent className="p-0">
              <div className="grid grid-cols-1 gap-6 p-6 sm:p-7 md:grid-cols-[auto_1fr_auto] md:gap-8 md:p-8">
                <div className="flex flex-row items-start justify-between gap-4 md:flex-col md:justify-start">
                  <span
                    className="font-mono text-3xl font-medium tabular-nums leading-none tracking-tight text-[var(--brand-primary)] md:text-4xl"
                    aria-hidden
                  >
                    {indexLabel}
                  </span>
                  {item.status ? (
                    <Badge variant="success" size="sm" className="capitalize">
                      {item.status}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-col gap-3.5">
                  <div className="flex flex-col gap-2">
                    {item.date ? (
                      <Text
                        as="span"
                        size="sm"
                        tone="secondary"
                        className="font-mono tracking-wide"
                      >
                        <time dateTime={item.date}>{item.date}</time>
                      </Text>
                    ) : null}
                    <Title
                      as="h3"
                      size={3}
                      className="!text-2xl sm:!text-3xl !leading-[1.15] !tracking-[-0.02em] text-[var(--strong-text-color)] transition-colors duration-200 group-hover:text-[var(--brand-primary)] motion-reduce:transition-none"
                    >
                      {item.title}
                    </Title>
                    <Text
                      as="span"
                      size="sm"
                      tone="secondary"
                      className="hidden font-mono tracking-wide break-all sm:inline"
                    >
                      {item.href}
                    </Text>
                  </div>

                  {item.summary != null ? (
                    <Text
                      as="p"
                      size="lg"
                      tone="secondary"
                      className="max-w-3xl leading-relaxed text-pretty"
                    >
                      {item.summary}
                    </Text>
                  ) : null}

                  {tags.length > 0 ? (
                    <div className="flex flex-row flex-wrap gap-2.5 pt-1.5">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="fact" size="md">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-end justify-between gap-3 md:flex-col md:items-end md:justify-start">
                  <Text
                    as="span"
                    size="sm"
                    weight="semibold"
                    className="inline-flex items-center gap-2 text-[var(--brand-primary)]"
                  >
                    {ctaLabel}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </Text>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
      })}
    </>
  );
}

/**
 * Ordered catalog of linked cards (research topics, series, releases).
 * Host maps domain data into `CatalogItem`; kit never imports app registries.
 */
export function CatalogList({
  items,
  emptyMessage = 'No items yet.',
  ctaLabel = 'Read more',
  renderLink = DefaultLink,
  maxTags = 6,
  className,
  ...props
}: CatalogListProps) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)] px-6 py-10 text-center"
        data-catalog-list-empty
      >
        <Text tone="secondary">{emptyMessage}</Text>
      </div>
    );
  }

  return (
    <ol
      className={cn('m-0 flex list-none flex-col gap-5 p-0', className)}
      data-catalog-list
      {...props}
    >
      {items.map((item, index) => (
        <li key={item.id}>
          <CatalogCard
            item={item}
            index={index + 1}
            ctaLabel={ctaLabel}
            maxTags={maxTags}
            renderLink={renderLink}
          />
        </li>
      ))}
    </ol>
  );
}

export default CatalogList;
