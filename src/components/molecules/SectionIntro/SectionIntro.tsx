import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Title } from '@/components/atoms/Title/Title.js';

export interface SectionIntroProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Mono overline (e.g. "Catalog", "Method"). */
  eyebrow?: React.ReactNode;
  /** Section heading. */
  title: React.ReactNode;
  /** Supporting body under the title. */
  description?: React.ReactNode;
  /** Optional meta line (count, status); sits opposite title in split layout. */
  meta?: React.ReactNode;
  /** id applied to the heading element (for aria-labelledby). */
  headingId?: string;
  /** Title size ladder (defaults to 2 for major bands). */
  titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * `stack` — stacked column.
   * `split` — title block left, meta right on md+.
   */
  layout?: 'stack' | 'split';
}

/**
 * Editorial section header: eyebrow, title, description, optional meta.
 * Content-agnostic shell for catalog, method, process, and similar bands.
 */
export function SectionIntro({
  eyebrow,
  title,
  description,
  meta,
  headingId,
  titleSize = 2,
  layout = 'stack',
  className,
  ...props
}: SectionIntroProps) {
  const isSplit = layout === 'split';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        isSplit &&
          'md:flex-row md:items-end md:justify-between md:gap-8 border-b border-[var(--border-color)] pb-8 mb-8 md:mb-10',
        !isSplit && meta == null && 'max-w-2xl',
        className
      )}
      {...props}
    >
      <div className={cn('flex flex-col gap-3', isSplit ? 'max-w-2xl' : undefined)}>
        {eyebrow != null && (
          <Text
            as="p"
            size="xs"
            tone="secondary"
            weight="medium"
            className="font-mono uppercase tracking-[0.16em]"
          >
            {eyebrow}
          </Text>
        )}
        <Title
          as="h2"
          id={headingId}
          size={titleSize}
          className={cn(
            'text-[var(--strong-text-color)]',
            titleSize <= 2 && '!text-3xl sm:!text-4xl !tracking-[-0.03em]',
            titleSize === 3 && '!tracking-[-0.025em]'
          )}
        >
          {title}
        </Title>
        {description != null && (
          <Text
            as="p"
            tone="secondary"
            className={cn('leading-relaxed', isSplit && 'max-w-xl')}
          >
            {description}
          </Text>
        )}
      </div>
      {meta != null && (
        <div className={cn(isSplit && 'shrink-0')}>{meta}</div>
      )}
    </div>
  );
}

export default SectionIntro;
