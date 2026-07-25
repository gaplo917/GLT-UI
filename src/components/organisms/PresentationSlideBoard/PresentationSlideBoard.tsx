import * as React from 'react';
import { PresentationSlideFrame } from '@/components/organisms/PresentationStrip/PresentationSlideFrame.js';
import { PresentationTitlePage } from '@/components/molecules/PresentationTitlePage/PresentationTitlePage.js';
import { PresentationBulletList } from '@/components/molecules/PresentationBulletList/PresentationBulletList.js';
import { PresentationDecisionCallout } from '@/components/molecules/PresentationDecisionCallout/PresentationDecisionCallout.js';
import { PresentationFigureKeypoints } from '@/components/molecules/PresentationFigureKeypoints/PresentationFigureKeypoints.js';
import { PresentationMythGrid } from '@/components/molecules/PresentationMythGrid/PresentationMythGrid.js';

export type PresentationSlideCallout = {
  impact: React.ReactNode;
  takeaways: React.ReactNode;
  nextActions: React.ReactNode;
};

export type PresentationSlideBoardLayout =
  | 'title'
  | 'bullets'
  | 'figure-wide'
  | 'figure-side'
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
  callout?: PresentationSlideCallout;
  figure?: React.ReactNode;
  figureCaption?: string;
  /** Close layout myth / watch cards. */
  cards?: readonly { title: string; body: string }[];
  className?: string;
}

/**
 * Content-agnostic presentation slide board. Host supplies all copy, figures,
 * and cards. Layout chrome via PresentationSlideFrame; body by `layout`.
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
  callout,
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
        <>
          {bullets ? <PresentationBulletList items={bullets} /> : null}
          {callout ? (
            <PresentationDecisionCallout
              impact={callout.impact}
              takeaways={callout.takeaways}
              nextActions={callout.nextActions}
            />
          ) : null}
        </>
      ) : null}

      {layout === 'figure-wide' && figure != null ? (
        <PresentationFigureKeypoints
          wide
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
          callout={callout}
        />
      ) : null}

      {layout === 'figure-side' && figure != null ? (
        <PresentationFigureKeypoints
          wide={false}
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
          callout={callout}
        />
      ) : null}

      {layout === 'close' ? (
        <>
          {bullets ? <PresentationBulletList items={bullets} /> : null}
          {cards && cards.length > 0 ? (
            <PresentationMythGrid cards={cards} />
          ) : null}
          {callout ? (
            <PresentationDecisionCallout
              impact={callout.impact}
              takeaways={callout.takeaways}
              nextActions={callout.nextActions}
            />
          ) : null}
        </>
      ) : null}
    </PresentationSlideFrame>
  );
}

export default PresentationSlideBoard;
