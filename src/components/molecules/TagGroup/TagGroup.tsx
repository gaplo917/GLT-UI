import * as React from 'react';
import { Badge, type BadgeSize } from '@/components/atoms/Badge/Badge.js';

export interface TagGroupProps {
  prefix?: React.ReactNode;
  tags: string[];
  /** Chip size; defaults to medium for readable tag rows. */
  size?: BadgeSize;
}

export function TagGroup({ prefix, tags, size = 'md' }: TagGroupProps) {
  return (
    <>
      {prefix}{' '}
      {tags.map((tag) => (
        <Badge key={tag} variant="fact" size={size} className="ml-1">
          {tag}
        </Badge>
      ))}
    </>
  );
}