"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";

export type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";

function approxMarkerWidth(n: number, fontSize: number): number {
  // Digits + brackets; slightly wide so multi-cite rows do not collide.
  return `[${n}]`.length * fontSize * 0.62;
}

function ariaLabel(entry: RefCiteItem): string {
  return `[${entry.n}] ${entry.author} · ${entry.dateLabel} · ${entry.publisher} — “${entry.title}”. ${entry.summary}`;
}

export type SvgRefCiteProps = {
  items: readonly RefCiteItem[];
  /** Center x of the whole cite row (viewBox units). */
  x: number;
  /** Vertical center y (viewBox units; text uses dominantBaseline middle). */
  y: number;
  fontSize?: number;
  /** Gap between markers (viewBox units). */
  gap?: number;
  className?: string;
};

type TipState = {
  entry: RefCiteItem;
  top: number;
  left: number;
  /** `translate(...)` so the bubble stays in-viewport near edges. */
  transform: string;
};

/**
 * In-SVG citation markers using native SVG `<a href="#ref-n">` + `<text>`.
 * Hover/focus opens a portaled HTML tooltip (same preview as body `RefCite`).
 * Keep the link in the SVG tree; only the bubble lives outside (document.body).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/a
 */
export function SvgRefCite({
  items,
  x,
  y,
  fontSize = 11,
  gap = 5,
  className,
}: SvgRefCiteProps) {
  const tipId = useId();
  const [mounted, setMounted] = useState(false);
  const [tip, setTip] = useState<TipState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hide = useCallback(() => setTip(null), []);

  const showFromTarget = useCallback(
    (entry: RefCiteItem, target: Element) => {
      const r = target.getBoundingClientRect();
      const gap = 8;
      const pad = 10;
      const vw = window.innerWidth;
      // Prefer above the marker; flip below when near the top of the viewport.
      const placeAbove = r.top > 120;
      const top = placeAbove ? r.top - gap : r.bottom + gap;
      // Keep horizontal center over the marker, then clamp in-viewport.
      let left = r.left + r.width / 2;
      left = Math.min(Math.max(left, pad + 96), vw - pad - 96);
      const xShift =
        left <= pad + 100
          ? "0"
          : left >= vw - pad - 100
            ? "-100%"
            : "-50%";
      const yShift = placeAbove ? "-100%" : "0";
      setTip({
        entry,
        top,
        left,
        transform: `translate(${xShift}, ${yShift})`,
      });
    },
    [],
  );

  useEffect(() => {
    if (!tip) return;
    const onReposition = () => setTip(null);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [tip]);

  if (items.length === 0) return null;

  const widths = items.map((e) => approxMarkerWidth(e.n, fontSize));
  const total =
    widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, items.length - 1);
  let cursor = x - total / 2;

  const bubble =
    mounted && tip
      ? createPortal(
          <span
            id={tipId}
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-max max-w-[18rem] whitespace-normal rounded-md bg-[var(--strong-text-color)] px-2.5 py-1.5 text-left text-xs leading-snug text-[var(--bg-color)] shadow-md"
            style={{
              top: tip.top,
              left: tip.left,
              transform: tip.transform,
            }}
          >
            <span className="block space-y-1 normal-case tracking-normal">
              <span className="block font-semibold">
                [{tip.entry.n}] {tip.entry.author}
              </span>
              <span className="block opacity-90">
                <time dateTime={tip.entry.date}>{tip.entry.dateLabel}</time>
                {" · "}
                {tip.entry.publisher}
              </span>
              <span className="block italic leading-snug">
                “{tip.entry.title}”
              </span>
              <span className="block leading-snug opacity-90">
                {tip.entry.summary}
              </span>
            </span>
          </span>,
          document.body,
        )
      : null;

  return (
    <g className={className} data-svg-ref-cite="">
      {items.map((entry, i) => {
        const w = widths[i]!;
        const cx = cursor + w / 2;
        cursor += w + gap;
        // Invisible hit pad — bare <text> glyphs are hard to hover.
        const hitPad = 4;
        const hitH = fontSize + hitPad * 2;
        const hitW = Math.max(w, fontSize * 1.6) + hitPad * 2;
        return (
          <a
            key={entry.n}
            href={`#ref-${entry.n}`}
            className="svg-ref-cite"
            data-ref-n={entry.n}
            aria-label={ariaLabel(entry)}
            aria-describedby={tip?.entry.n === entry.n ? tipId : undefined}
            onMouseEnter={(e) => showFromTarget(entry, e.currentTarget)}
            onMouseLeave={hide}
            onFocus={(e) => showFromTarget(entry, e.currentTarget)}
            onBlur={hide}
          >
            <rect
              x={cx - hitW / 2}
              y={y - hitH / 2}
              width={hitW}
              height={hitH}
              fill="transparent"
              className="svg-ref-cite-hit"
            />
            <text
              x={cx}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="svg-ref-cite-text"
              style={{ fontSize }}
            >
              [{entry.n}]
            </text>
          </a>
        );
      })}
      {bubble}
    </g>
  );
}
