'use client';

import * as React from 'react';
import { Badge } from '@/components/atoms/Badge/Badge.js';
import { Grid } from '@/components/atoms/Grid/Grid.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/organisms/Card/Card.js';

export interface TechniqueItem {
  id: string;
  org: string;
  title: string;
  summary: string;
  impact: string;
}

export interface TechniqueGridProps {
  items: TechniqueItem[];
  onSelect?: (item: TechniqueItem) => void;
  emptyMessage?: string;
  className?: string;
}

/** A responsive grid of clickable technique cards, built from Grid + Card + Badge + Text atoms. */
export function TechniqueGrid({
  items,
  onSelect,
  emptyMessage = 'No items for filter.',
  className,
}: TechniqueGridProps) {
  return (
    <Grid columns={1} mdColumns={2} gap={4} className={className}>
      {items.map((item) => (
        <Card key={item.id} variant="tech" interactive className="h-full" onClick={() => onSelect?.(item)}>
          <CardHeader>
            <div className="flex flex-1 items-start justify-between px-4 py-3">
              <Badge variant="fact">{item.org}</Badge>
              <Text as="span" size="sm" tone="secondary">clickable</Text>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
            <Text className="mt-2">{item.summary}</Text>
          </CardContent>
          <CardFooter>
            <Text as="div" tone="brand" className="px-4 py-3">{item.impact}</Text>
          </CardFooter>
        </Card>
      ))}
      {items.length === 0 && (
        <Text as="div" tone="secondary" className="col-span-full p-4 opacity-80">
          {emptyMessage}
        </Text>
      )}
    </Grid>
  );
}

export default TechniqueGrid;
