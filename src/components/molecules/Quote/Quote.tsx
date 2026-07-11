import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Icon } from '@/components/atoms/Icon/Icon.js';

export type QuoteVariant = 'plain' | 'bordered' | 'highlight';
export type QuoteSize = 'md' | 'lg';

export interface QuoteProps extends Omit<React.HTMLAttributes<HTMLElement>, 'cite'> {
  /** Attribution — the person or work being quoted. */
  cite?: React.ReactNode;
  /** Secondary attribution line (role, source, date). */
  source?: React.ReactNode;
  variant?: QuoteVariant;
  size?: QuoteSize;
}

const variantClasses: Record<QuoteVariant, string> = {
  plain: '',
  bordered: 'border-l-2 border-[var(--brand-primary)] pl-6 md:pl-8',
  highlight: 'rounded-2xl border border-[var(--border-color)] bg-[var(--brand-primary)]/[0.05] p-7 md:p-10',
};

const textSize: Record<QuoteSize, string> = {
  md: 'text-2xl md:text-[1.6rem]',
  lg: 'text-[1.75rem] md:text-[2.35rem]',
};

const markSize: Record<QuoteSize, string> = {
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-6xl',
};

// Serif display face (from --blockquote-font-family) for the quote + mark.
const serif: React.CSSProperties = { fontFamily: 'var(--blockquote-font-family)' };

/**
 * A bold, editorial pull-quote for statements that should stand out strongly.
 *
 * Uses the design system's display serif (`--blockquote-font-family`). The
 * decorative quotation mark sits on its own line above the text — deliberate,
 * not overlapping — followed by an optional attribution line.
 */
export const Quote = React.forwardRef<HTMLElement, QuoteProps>(
  ({ className, cite, source, variant = 'highlight', size = 'lg', children, ...props }, ref) => (
    <figure ref={ref} className={cn('flex flex-col', variantClasses[variant], className)} {...props}>
      <Icon
        icon={'“'}
        tone="inherit"
        style={serif}
        className={cn('mb-1 block leading-[0.6] text-[var(--brand-primary)]', markSize[size])}
      />
      <blockquote
        style={serif}
        className={cn(
          'text-pretty font-medium tracking-[-0.01em] text-[var(--strong-text-color)]',
          textSize[size],
          size === 'lg' ? 'leading-[1.18]' : 'leading-[1.28]'
        )}
      >
        {children}
      </blockquote>
      {(cite || source) && (
        <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span aria-hidden="true" className="h-px w-8 shrink-0 bg-[var(--brand-primary)]" />
          {cite && <Text as="span" size="sm" weight="semibold" tone="strong">{cite}</Text>}
          {source && <Text as="span" size="sm" tone="secondary">{source}</Text>}
        </figcaption>
      )}
    </figure>
  )
);
Quote.displayName = 'Quote';

export default Quote;
