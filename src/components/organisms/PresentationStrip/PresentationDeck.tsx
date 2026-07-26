"use client";

import * as React from "react";
import {
  PresentationStrip,
  type PresentationStripChrome,
  type PresentationThumb,
} from "./PresentationStrip.js";

export type PresentationDeckSlide = {
  id: string;
  num: string;
  label: string;
  /** Full slide board (e.g. PresentationSlideBoard with custom figure). */
  board: React.ReactNode;
};

export type PresentationDeckProps = {
  slides: readonly PresentationDeckSlide[];
  label?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  dialogTitle?: React.ReactNode;
  slideNaturalW?: number;
  slideNaturalH?: number;
  chrome?: PresentationStripChrome;
  className?: string;
};

/**
 * Presentation strip + fullscreen present mode where each slide’s board is
 * authored by the host (no shared kind/layout switcher). Pass one `board` per
 * slide — typically a PresentationSlideBoard with any figure/layout.
 */
export function PresentationDeck({
  slides,
  label,
  title,
  description,
  dialogTitle,
  slideNaturalW = 960,
  slideNaturalH = 540,
  chrome,
  className,
}: PresentationDeckProps) {
  const thumbs: PresentationThumb[] = slides.map(({ id, num, label: lbl }) => ({
    id,
    num,
    label: lbl,
  }));

  return (
    <PresentationStrip
      slides={thumbs}
      label={label}
      title={title}
      description={description}
      dialogTitle={dialogTitle}
      slideNaturalW={slideNaturalW}
      slideNaturalH={slideNaturalH}
      chrome={chrome}
      className={className}
      renderSlide={(index) => slides[index]?.board ?? null}
    />
  );
}

export default PresentationDeck;
