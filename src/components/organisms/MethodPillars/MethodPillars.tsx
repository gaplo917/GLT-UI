import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Container } from '@/components/atoms/Container/Container.js';
import { Grid } from '@/components/atoms/Grid/Grid.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Title } from '@/components/atoms/Title/Title.js';
import { SectionIntro } from '@/components/molecules/SectionIntro/SectionIntro.js';

export type MethodPillar = {
  title: React.ReactNode;
  body: React.ReactNode;
};

export interface MethodPillarsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  pillars: readonly MethodPillar[];
  /** id for the section heading (aria-labelledby). */
  headingId?: string;
}

/**
 * Compact pillars band: section intro + equal grid of claim cards.
 * Host supplies all copy; kit only structures layout.
 */
export function MethodPillars({
  eyebrow,
  title,
  description,
  pillars,
  headingId = 'method-pillars-heading',
  className,
  ...props
}: MethodPillarsProps) {
  return (
    <section
      className={cn(
        'border-t border-[var(--border-color)] bg-[var(--card-bg-color)]/40',
        className
      )}
      aria-labelledby={headingId}
      {...props}
    >
      <Container className="pt-14 pb-10 md:pt-16 md:pb-12">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          headingId={headingId}
          titleSize={3}
          className="mb-8"
        />

        <Grid columns={1} mdColumns={3} gap={6}>
          {pillars.map((pillar, i) => (
            <article
              key={i}
              className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-color)]/60 p-5"
            >
              <Title as="h3" size={5} className="!text-base !tracking-tight">
                {pillar.title}
              </Title>
              <Text as="p" size="sm" tone="secondary" className="leading-relaxed">
                {pillar.body}
              </Text>
            </article>
          ))}
        </Grid>
      </Container>
    </section>
  );
}

export default MethodPillars;
