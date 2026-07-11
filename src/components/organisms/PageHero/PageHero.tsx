import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Title } from '@/components/atoms/Title/Title.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface PageHeroProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  footnote?: React.ReactNode;
  className?: string;
}

/** A page-opening hero, composed from the Title and Text atoms. */
export function PageHero({ badge, title, lead, actions, footnote, className }: PageHeroProps) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {badge != null && <div className="mb-3">{badge}</div>}
      <Title as="h1" size={1} className="text-6xl md:text-6xl leading-[0.96] tracking-[-0.04em]">
        {title}
      </Title>
      {lead != null && (
        <Text as="p" size="2xl" tone="secondary" className="mt-5">
          {lead}
        </Text>
      )}
      {actions != null && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      {footnote != null && (
        <Text as="div" size="base" tone="secondary" className="mt-4">
          {footnote}
        </Text>
      )}
    </div>
  );
}

export default PageHero;
