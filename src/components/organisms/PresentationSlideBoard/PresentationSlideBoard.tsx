import * as React from 'react';
import { PresentationSlideFrame } from '@/components/organisms/PresentationStrip/PresentationSlideFrame.js';
import { PresentationTitlePage } from '@/components/molecules/PresentationTitlePage/PresentationTitlePage.js';
import { PresentationProseColumns } from '@/components/molecules/PresentationProseColumns/PresentationProseColumns.js';
import { PresentationFigureKeypoints } from '@/components/molecules/PresentationFigureKeypoints/PresentationFigureKeypoints.js';
import { PresentationMythGrid } from '@/components/molecules/PresentationMythGrid/PresentationMythGrid.js';

export type PresentationSlideCallout = {
  impact: React.ReactNode;
  takeaways: React.ReactNode;
  nextActions: React.ReactNode;
  impactLabel?: string;
  takeawaysLabel?: string;
  nextActionsLabel?: string;
};

/** Row overlines for PresentationDecisionCallout (host-locale). */
export type PresentationCalloutLabels = {
  impactLabel: string;
  takeawaysLabel: string;
  nextActionsLabel: string;
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
  /**
   * Locale row labels for the decision callout (Impact / Takeaways / Next actions).
   * Applied whenever `callout` is set; host should always pass these for i18n.
   */
  calloutLabels?: PresentationCalloutLabels;
  figure?: React.ReactNode;
  figureCaption?: string;
  /** Close layout myth / watch cards. */
  cards?: readonly { title: string; body: string }[];
  className?: string;
}

/**
 * Content-agnostic presentation slide board. Host supplies all copy, figures,
 * and cards. Layout chrome via PresentationSlideFrame; body by `layout`.
 * Prose uses left-right columns (bullets | impact) for board-length reading.
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
  calloutLabels,
  figure,
  figureCaption,
  cards,
  className,
}: PresentationSlideBoardProps) {
  const isTitle = layout === 'title';
  const labeledCallout =
    callout == null
      ? undefined
      : {
          impact: callout.impact,
          takeaways: callout.takeaways,
          nextActions: callout.nextActions,
          impactLabel: callout.impactLabel ?? calloutLabels?.impactLabel,
          takeawaysLabel: callout.takeawaysLabel ?? calloutLabels?.takeawaysLabel,
          nextActionsLabel:
            callout.nextActionsLabel ?? calloutLabels?.nextActionsLabel,
        };

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
        <PresentationProseColumns
          bullets={bullets}
          callout={labeledCallout}
        />
      ) : null}

      {layout === 'figure-wide' && figure != null ? (
        <PresentationFigureKeypoints
          wide
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
          callout={labeledCallout}
        />
      ) : null}

      {layout === 'figure-side' && figure != null ? (
        <PresentationFigureKeypoints
          wide={false}
          caption={figureCaption}
          figure={figure}
          bullets={bullets}
          callout={labeledCallout}
        />
      ) : null}

      {layout === 'close' ? (
        <PresentationProseColumns
          bullets={bullets}
          callout={labeledCallout}
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
