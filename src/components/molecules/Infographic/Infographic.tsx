import * as React from 'react';
import {
  FullBleedFigure,
  type FullBleedFigureProps,
} from '@/components/molecules/Figure/FullBleedFigure.js';

export type InfographicProps = FullBleedFigureProps;

/**
 * Research figure shell — full-bleed so charts breathe outside the prose column.
 * Authoring alias over `FullBleedFigure` (same layout; preferred name in essays).
 */
export function Infographic({
  title,
  caption,
  maxWidth,
  children,
  className,
  ...props
}: InfographicProps) {
  return (
    <FullBleedFigure
      title={title}
      caption={caption}
      maxWidth={maxWidth}
      className={className}
      {...props}
    >
      {children}
    </FullBleedFigure>
  );
}

export default Infographic;
