import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { PresentationProseColumns } from '@/components/molecules/PresentationProseColumns/PresentationProseColumns.js';

export interface PresentationFigureKeypointsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * When true, stack figure above keypoints (wide / landscape figures).
   * When false, side-by-side: left image, right text.
   */
  wide: boolean;
  /** Chart / diagram node (host-supplied). */
  figure: React.ReactNode;
  /** Optional key bullets beside or below the figure. */
  bullets?: readonly React.ReactNode[];
  /** Optional caption above the figure (wide layout only). */
  caption?: string;
}

/**
 * Contain-fit the hosted SVG or canvas in CSS. viewBox +
 * preserveAspectRatio (SVG) and object-fit (canvas) do the scaling.
 * Do not measure or transform in JavaScript.
 */
function PresentationFigureFit({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-presentation-figure=""
      className={cn('pres-fig-fit min-h-0 min-w-0 flex-1 overflow-hidden', className)}
    >
      <style>{fitCss}</style>
      {children}
    </div>
  );
}

const fitCss = `
.pres-fig-fit {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pres-fig-fit > * {
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
}
.pres-fig-fit svg,
.pres-fig-fit canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain;
}
`;

/**
 * Figure + keypoints layout for presentation decks.
 * Wide: figure on top, bullets under.
 * Side: left image, right bullets.
 */
export function PresentationFigureKeypoints({
  wide,
  figure,
  bullets,
  caption,
  className,
  ...props
}: PresentationFigureKeypointsProps) {
  if (wide) {
    return (
      <div
        className={cn('flex min-h-0 min-w-0 flex-1 flex-col gap-2', className)}
        data-presentation-figure-slot="stack"
        {...props}
      >
        <div
          className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-1.5"
          style={{ height: 280, maxHeight: 280 }}
        >
          {caption ? (
            <p className="m-0 mb-1 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text-color)]">
              {caption}
            </p>
          ) : null}
          <PresentationFigureFit>{figure}</PresentationFigureFit>
        </div>
        <PresentationProseColumns
          className="min-h-0 min-w-0 flex-1"
          bullets={bullets}
        />
      </div>
    );
  }

  // Left image · right text. Inline grid template
  // avoids relying on Tailwind scanning arbitrary fr classes from the package.
  return (
    <div
      className={cn('grid min-h-0 min-w-0 flex-1 gap-3', className)}
      data-presentation-figure-slot="split"
      style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)' }}
      {...props}
    >
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)]/40 p-2">
        <PresentationFigureFit className="relative">
          {figure}
        </PresentationFigureFit>
      </div>
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <PresentationProseColumns
          className="min-h-0 flex-1 overflow-y-auto"
          bullets={bullets}
        />
      </div>
    </div>
  );
}

export default PresentationFigureKeypoints;
