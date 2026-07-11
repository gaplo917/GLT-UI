'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Surface } from '../../atoms/Surface/Surface.js';
import { Text } from '../../atoms/Text/Text.js';

export interface FigureProps extends React.HTMLAttributes<HTMLElement> {
  /** The visual — a Chart, image, table, diagram, etc. */
  children: React.ReactNode;
  /** Figure number or identifier, e.g. `1` or `"3a"`. */
  index?: number | string;
  /** The word before the number. Defaults to "Figure". */
  label?: string;
  /** Caption text rendered beneath the visual. */
  caption?: React.ReactNode;
  /** Place the caption above the visual instead of below. */
  captionPlacement?: 'top' | 'bottom';
  /** Wrap the visual in a bordered surface. Defaults to true. */
  framed?: boolean;
}

/**
 * A numbered figure with a caption, styled after a research paper. Pairs a
 * visual (chart, image, table) with a "Figure N." caption using the Text atom,
 * and frames it on a Surface. Renders semantic `<figure>` / `<figcaption>`.
 */
export const Figure = React.forwardRef<HTMLElement, FigureProps>(
  ({ children, index, label = 'Figure', caption, captionPlacement = 'bottom', framed = true, className, ...props }, ref) => {
    const captionNode = (caption != null || index != null) && (
      <figcaption className={cn(captionPlacement === 'top' ? 'mb-3' : 'mt-3')}>
        <Text as="span" size="sm" tone="secondary">
          {index != null && (
            <Text as="span" size="sm" weight="semibold" tone="brand">
              {label} {index}.{' '}
            </Text>
          )}
          {caption}
        </Text>
      </figcaption>
    );

    return (
      <figure ref={ref} className={cn('m-0', className)} {...props}>
        {captionPlacement === 'top' && captionNode}
        {framed ? (
          <Surface tone="plain" bordered radius="lg" padding="md">
            {children}
          </Surface>
        ) : (
          children
        )}
        {captionPlacement === 'bottom' && captionNode}
      </figure>
    );
  }
);
Figure.displayName = 'Figure';

export default Figure;
