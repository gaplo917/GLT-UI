import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Container } from '@/components/atoms/Container/Container.js';
import { Title } from '@/components/atoms/Title/Title.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section id for navigation / deep links (research pages often have #thesis etc) */
  id?: string;
  /** Inner container max width */
  containerMax?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Vertical spacing override */
  spacing?: 'tight' | 'normal' | 'loose';
}

const spacingMap = {
  tight: 'py-8',
  normal: 'py-12 md:py-16',
  loose: 'py-16 md:py-20',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, id, containerMax = 'xl', spacing = 'normal', children, ...props }, ref) => (
    <section
      ref={ref}
      id={id}
      className={cn('scroll-mt-16', spacingMap[spacing], className)}
      {...props}
    >
      <Container max={containerMax}>{children}</Container>
    </section>
  )
);
Section.displayName = 'Section';

export const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-6 md:mb-8', className)} {...props} />
  )
);
SectionHeader.displayName = 'SectionHeader';

export const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Title
      ref={ref}
      as="h2"
      size={3}
      className={cn('section-header md:text-4xl tracking-[-0.025em] mb-3', className)}
      {...props}
    />
  )
);
SectionTitle.displayName = 'SectionTitle';

export const SectionLead = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} as="p" size="base" tone="secondary" className={cn('max-w-2xl', className)} {...props} />
  )
);
SectionLead.displayName = 'SectionLead';

export default Section;
