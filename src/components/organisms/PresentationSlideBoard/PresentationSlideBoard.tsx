import * as React from 'react';
import { PresentationSlideFrame } from '@/components/organisms/PresentationStrip/PresentationSlideFrame.js';
import { PresentationTitlePage } from '@/components/molecules/PresentationTitlePage/PresentationTitlePage.js';
import { PresentationProseColumns } from '@/components/molecules/PresentationProseColumns/PresentationProseColumns.js';
import { PresentationFigureKeypoints } from '@/components/molecules/PresentationFigureKeypoints/PresentationFigureKeypoints.js';
import {
  PresentationMythGrid,
  type PresentationMythCard,
} from '@/components/molecules/PresentationMythGrid/PresentationMythGrid.js';

export type PresentationSlideBoardLayout =
  | 'title'
  | 'bullets'
  | 'figure-wide'
  | 'figure-side'
  | 'cards'
  | 'close';

export interface PresentationSlideBoardProps {
  layout: PresentationSlideBoardLayout;
  /** Natural board width. Default 960. */
  naturalW?: number;
  /** Natural board height. Default 540. */
  naturalH?: number;
  /** data-presentation-slide value (optional host id). */
  slideId?: string;
  /** data-presentation-num value (optional deck number). */
  slideNum?: string;
  /** Uppercase kicker (header band or title-page overline). */
  kicker?: React.ReactNode;
  /** Slide title (header band or title-page headline). */
  title?: React.ReactNode;
  /** Optional brand / meta block in the header (host-supplied). */
  brandMeta?: React.ReactNode;
  /** Title layout: primary credit line. */
  credit?: React.ReactNode;
  /** Title layout: secondary credit line. */
  creditDetail?: React.ReactNode;
  bullets?: readonly React.ReactNode[];
  figure?: React.ReactNode;
  figureCaption?: string;
  /** Cards layout (fills the board) / close-layout myth cards. */
  cards?: readonly PresentationMythCard[];
  className?: string;
}

/**
 * Content-agnostic presentation slide board. Host supplies all copy, figures,
 * and cards. Layout chrome via PresentationSlideFrame; body by `layout`.
 * Figure pairing: `figure-side` left/right (4:3 + remaining prose),
 * `figure-wide` top/bottom (2:1 + remaining prose). No full-body figure layout.
 */
export function PresentationSlideBoard({
  layout,
  naturalW = 960,
  naturalH = 540,
  slideId,
  slideNum,
  kicker,
  title,
  brandMeta,
  credit,
  creditDetail,
  bullets,
  figure,
  figureCaption,
  cards,
  className,
}: PresentationSlideBoardProps) {
  const isTitle = layout === 'title';

  return (
    <PresentationSlideFrame
      hideHeader={isTitle}
      kicker={isTitle ? undefined : kicker}
      title={isTitle ? undefined : title}
      brandMeta={isTitle ? undefined : brandMeta}
      naturalW={naturalW}
      naturalH={naturalH}
      slideId={slideId}
      slideNum={slideNum}
      className={className}
    >
      {layout === 'title' && kicker != null && title != null ? (
        <PresentationTitlePage
          kicker={kicker}
          title={title}
          credit={credit}
          creditDetail={creditDetail}
        />
      ) : null}

      {layout === 'bullets' ? (
        <PresentationProseColumns bullets={bullets} />
      ) : null}

      {layout === 'figure-wide' && figure != null ? (
        <PresentationFigureKeypoints
          wide
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
        />
      ) : null}

      {layout === 'figure-side' && figure != null ? (
        <PresentationFigureKeypoints
          wide={false}
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
        />
      ) : null}

      {layout === 'cards' ? (
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          {cards && cards.length > 0 ? (
            <PresentationMythGrid className="h-full min-h-0" cards={cards} />
          ) : null}
        </div>
      ) : null}

      {layout === 'close' ? (
        <PresentationProseColumns
          bullets={bullets}
          leftExtra={
            cards && cards.length > 0 ? (
              <PresentationMythGrid cards={cards} />
            ) : null
          }
        />
      ) : null}
    </PresentationSlideFrame>
  );
}

export default PresentationSlideBoard;
