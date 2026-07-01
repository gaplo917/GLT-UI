import * as React from 'react';
import { Text } from '../../atoms/Text/Text.js';

export interface BreadcrumbProps {
  items: string[];
  suffix?: React.ReactNode;
}

/** A trail of location labels, composed from the Text atom. */
export function Breadcrumb({ items, suffix }: BreadcrumbProps) {
  return (
    <nav className="flex gap-1">
      {items.map((item, i) => (
        <Text as="span" key={i} size="base">
          {item}
          {i < items.length - 1 && (
            <Text as="span" tone="secondary"> / </Text>
          )}
        </Text>
      ))}
      {suffix != null && (
        <Text as="span" size="base" tone="secondary">
          {suffix}
        </Text>
      )}
    </nav>
  );
}

export default Breadcrumb;
