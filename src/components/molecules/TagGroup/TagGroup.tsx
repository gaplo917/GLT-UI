import * as React from 'react';
import { Badge } from '@/components/atoms/Badge/Badge.js';

export interface TagGroupProps {
  prefix?: React.ReactNode;
  tags: string[];
}

export function TagGroup({ prefix, tags }: TagGroupProps) {
  return (
    <>
      {prefix}{' '}
      {tags.map((tag) => (
        <Badge key={tag} variant="fact" className="ml-1">
          {tag}
        </Badge>
      ))}
    </>
  );
}