/**
 * Animated vertical milestone timeline.
 * Day deltas are node callouts and stagger timing — not a plotted Y-axis.
 * One fluid SVG for every viewport (~4:3 canvas).
 */

import * as React from "react";
import { wrapLines } from "@/components/organisms/MultiModePolicyBand/wrapLines.js";

export type TimelineItem = {
  id?: string;
  /** Day callout, e.g. "+0d", "+9d". */
  dayLabel: string;
  /** Milestone title. */
  title: string;
  /** Optional date or short blurb under the title. */
  detail?: string;
  /** Brand stroke/fill on the card. Default: first and last brand; others neutral. */
  tone?: "brand" | "neutral";
  /**
   * Optional numeric days after the origin for stagger timing.
   * Spacing between nodes stays even for readability.
   */
  daysAfter?: number;
};

export type VerticalTimelineProps = {
  items: readonly TimelineItem[];
  title?: string;
  description?: string;
  /** Enable draw-on / stagger / pulse. Honors prefers-reduced-motion. */
  animated?: boolean;
  className?: string;
};

const VB_W = 960;
const VB_H = 720;
const MID_X = 480;
const CARD_W = 348;
const CARD_PAD_X = 18;
const CARD_PAD_TOP = 16;
const CARD_PAD_BOTTOM = 16;
const TITLE_LINE_H = 22;
const DETAIL_LINE_H = 18;
const TITLE_MAX = 28;
const DETAIL_MAX = 34;
const NODE_R = 11;
const DAY_CHIP_H = 28;
const SIDE_GAP = 36;

function approxChipWidth(label: string): number {
  return Math.min(96, Math.max(52, label.length * 9.2 + 24));
}

function cardHeight(titleLines: number, detailLines: number): number {
  const titleBlock = Math.max(1, titleLines) * TITLE_LINE_H;
  const detailBlock =
    detailLines > 0 ? 6 + detailLines * DETAIL_LINE_H : 0;
  return CARD_PAD_TOP + titleBlock + detailBlock + CARD_PAD_BOTTOM;
}

/**
 * Vertical timeline with a center spine, alternating cards, and day callouts.
 */
export function VerticalTimeline({
  items,
  title = "",
  description = "",
  animated = true,
  className,
}: VerticalTimelineProps) {
  const uid = React.useId().replace(/:/g, "");

  if (items.length < 2) return null;

  const prepared = items.map((item, i) => {
    const titleLines = wrapLines(item.title, TITLE_MAX, 2);
    const detailLines = item.detail
      ? wrapLines(item.detail, DETAIL_MAX, 2)
      : [];
    const h = cardHeight(titleLines.length, detailLines.length);
    const tone =
      item.tone ?? (i === 0 || i === items.length - 1 ? "brand" : "neutral");
    const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
    return {
      ...item,
      id: item.id ?? `vt-${i}`,
      titleLines,
      detailLines,
      h,
      tone,
      side,
      daysAfter: item.daysAfter ?? i,
    };
  });

  const topY = 58;
  const bottomY = VB_H - 58;
  const span = bottomY - topY;
  const step = prepared.length > 1 ? span / (prepared.length - 1) : 0;

  const nodes = prepared.map((item, i) => {
    const cy = topY + i * step;
    const cardX =
      item.side === "left" ? MID_X - SIDE_GAP - CARD_W : MID_X + SIDE_GAP;
    const cardY = cy - item.h / 2;
    const connectorX1 =
      item.side === "left" ? cardX + CARD_W : cardX;
    const connectorX2 =
      item.side === "left" ? MID_X - NODE_R - 2 : MID_X + NODE_R + 2;
    const dayW = approxChipWidth(item.dayLabel);
    // Day chip sits on the opposite rail of the card so title stays readable.
    const dayX =
      item.side === "left"
        ? MID_X + 18
        : MID_X - 18 - dayW;
    const dayY = cy - DAY_CHIP_H / 2;
    return {
      ...item,
      cy,
      cardX,
      cardY,
      connectorX1,
      connectorX2,
      dayW,
      dayX,
      dayY,
      index: i,
    };
  });

  const maxDays = Math.max(1, ...nodes.map((n) => n.daysAfter));
  const spineD = `M ${MID_X} ${topY} L ${MID_X} ${bottomY}`;

  return (
    <div
      className={["vt w-full min-w-0", animated ? "vt--animated" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      data-figure="vertical-timeline"
    >
      <style>{CSS}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={
          title || description ? `${uid}-title ${uid}-desc` : undefined
        }
        aria-label={
          !title && !description ? "Vertical milestone timeline" : undefined
        }
      >
        <title id={`${uid}-title`}>{title}</title>
        <desc id={`${uid}-desc`}>{description}</desc>

        <defs>
          <linearGradient
            id={`${uid}-flow`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="var(--brand-primary)"
              stopOpacity="0.15"
            />
            <stop
              offset="45%"
              stopColor="var(--brand-primary)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--brand-primary)"
              stopOpacity="0.15"
            />
          </linearGradient>
          <filter
            id={`${uid}-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id={`${uid}-spine`} d={spineD} fill="none" />
        </defs>

        {/* Track base */}
        <path
          d={spineD}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Draw-on brand overlay */}
        <path
          className="vt-spine-draw"
          d={spineD}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={100}
        />
        {/* Continuous dash pulse */}
        <path
          className="vt-spine-flow"
          d={spineD}
          fill="none"
          stroke={`url(#${uid}-flow)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={100}
        />

        {animated ? (
          <circle
            className="vt-pulse"
            r="4.5"
            fill="var(--brand-primary)"
            filter={`url(#${uid}-glow)`}
          >
            <animateMotion
              className="vt-motion"
              dur="3.6s"
              repeatCount="indefinite"
              path={spineD}
            />
          </circle>
        ) : null}

        {nodes.map((node) => {
          const delayFrac = node.daysAfter / maxDays;
          const style = {
            ["--vt-delay" as string]: `${(0.18 + delayFrac * 1.4).toFixed(2)}s`,
          } as React.CSSProperties;
          return (
            <g
              key={node.id}
              className="vt-node"
              style={style}
              data-timeline-node={node.id}
            >
              {/* Connector from card to spine */}
              <line
                className="vt-connector"
                x1={node.connectorX1}
                y1={node.cy}
                x2={node.connectorX2}
                y2={node.cy}
              />

              {/* Card */}
              <rect
                x={node.cardX}
                y={node.cardY}
                width={CARD_W}
                height={node.h}
                rx={14}
                className={`vt-card vt-card--${node.tone}`}
              />
              {/* Invisible padding box documents inset contract */}
              <rect
                x={node.cardX + CARD_PAD_X}
                y={node.cardY + CARD_PAD_TOP}
                width={CARD_W - CARD_PAD_X * 2}
                height={node.h - CARD_PAD_TOP - CARD_PAD_BOTTOM}
                fill="transparent"
                pointerEvents="none"
              />
              <text
                x={
                  node.side === "left"
                    ? node.cardX + CARD_W - CARD_PAD_X
                    : node.cardX + CARD_PAD_X
                }
                y={node.cardY + CARD_PAD_TOP + TITLE_LINE_H - 4}
                textAnchor={node.side === "left" ? "end" : "start"}
                className={`vt-card-title vt-card-title--${node.tone}`}
              >
                {node.titleLines.map((line, li) => (
                  <tspan
                    key={`${node.id}-t-${li}`}
                    x={
                      node.side === "left"
                        ? node.cardX + CARD_W - CARD_PAD_X
                        : node.cardX + CARD_PAD_X
                    }
                    dy={li === 0 ? 0 : TITLE_LINE_H}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              {node.detailLines.length > 0 ? (
                <text
                  x={
                    node.side === "left"
                      ? node.cardX + CARD_W - CARD_PAD_X
                      : node.cardX + CARD_PAD_X
                  }
                  y={
                    node.cardY +
                    CARD_PAD_TOP +
                    node.titleLines.length * TITLE_LINE_H +
                    6 +
                    DETAIL_LINE_H -
                    4
                  }
                  textAnchor={node.side === "left" ? "end" : "start"}
                  className="vt-card-detail"
                >
                  {node.detailLines.map((line, li) => (
                    <tspan
                      key={`${node.id}-d-${li}`}
                      x={
                        node.side === "left"
                          ? node.cardX + CARD_W - CARD_PAD_X
                          : node.cardX + CARD_PAD_X
                      }
                      dy={li === 0 ? 0 : DETAIL_LINE_H}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              ) : null}

              {/* Day callout chip */}
              <rect
                x={node.dayX}
                y={node.dayY}
                width={node.dayW}
                height={DAY_CHIP_H}
                rx={DAY_CHIP_H / 2}
                className={`vt-day vt-day--${node.tone}`}
              />
              <text
                x={node.dayX + node.dayW / 2}
                y={node.dayY + DAY_CHIP_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`vt-day-label vt-day-label--${node.tone}`}
              >
                {node.dayLabel}
              </text>

              {/* Spine node */}
              <circle
                cx={MID_X}
                cy={node.cy}
                r={NODE_R + 6}
                className={`vt-node-halo vt-node-halo--${node.tone}`}
              />
              <circle
                cx={MID_X}
                cy={node.cy}
                r={NODE_R}
                className={`vt-node-disc vt-node-disc--${node.tone}`}
              />
              <circle
                cx={MID_X}
                cy={node.cy}
                r={5}
                className={`vt-node-core vt-node-core--${node.tone}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const CSS = `
.vt-spine-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
}
.vt--animated .vt-spine-draw {
  animation: vt-draw 1.6s ease-out both;
}
.vt-spine-flow {
  stroke-dasharray: 14 86;
  stroke-dashoffset: 0;
  opacity: 0;
}
.vt--animated .vt-spine-flow {
  opacity: 1;
  animation: vt-flow 2.8s linear infinite;
  animation-delay: 1.4s;
}
.vt-connector {
  stroke: color-mix(in srgb, var(--border-color) 80%, var(--brand-primary) 20%);
  stroke-width: 1.6;
  stroke-linecap: round;
}
.vt-card {
  stroke-width: 1.5;
}
.vt-card--neutral {
  fill: color-mix(in srgb, var(--card-bg-color, var(--bg-color)) 94%, transparent);
  stroke: var(--border-color);
}
.vt-card--brand {
  fill: color-mix(in srgb, var(--brand-primary) 10%, var(--card-bg-color, var(--bg-color)));
  stroke: color-mix(in srgb, var(--brand-primary) 55%, var(--border-color));
}
.vt-card-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
}
.vt-card-title--brand {
  fill: var(--brand-primary);
}
.vt-card-detail {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: var(--text-sm);
  font-weight: 500;
}
.vt-day {
  stroke-width: 1.25;
}
.vt-day--neutral {
  fill: var(--bg-color, var(--card-bg-color));
  stroke: var(--border-color);
}
.vt-day--brand {
  fill: color-mix(in srgb, var(--brand-primary) 14%, var(--bg-color, var(--card-bg-color)));
  stroke: color-mix(in srgb, var(--brand-primary) 50%, var(--border-color));
}
.vt-day-label {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}
.vt-day-label--brand {
  fill: var(--brand-primary);
}
.vt-node-halo {
  fill: none;
  stroke-width: 4;
  opacity: 0.35;
}
.vt-node-halo--neutral {
  stroke: color-mix(in srgb, var(--brand-primary) 28%, transparent);
}
.vt-node-halo--brand {
  stroke: color-mix(in srgb, var(--brand-primary) 42%, transparent);
}
.vt-node-disc {
  fill: var(--bg-color, var(--card-bg-color));
  stroke-width: 2.25;
}
.vt-node-disc--neutral {
  stroke: var(--brand-primary);
}
.vt-node-disc--brand {
  stroke: var(--brand-primary);
}
.vt-node-core {
  fill: var(--brand-primary);
}
.vt-pulse {
  pointer-events: none;
}
.vt-node {
  opacity: 1;
}
.vt--animated .vt-node-halo {
  animation: vt-halo 2.6s ease-in-out infinite;
  animation-delay: var(--vt-delay, 0.2s);
}
.vt--animated .vt-node-core {
  transform-box: fill-box;
  transform-origin: center;
  animation: vt-core 2.4s ease-in-out infinite;
  animation-delay: var(--vt-delay, 0.2s);
}
@keyframes vt-draw {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}
@keyframes vt-flow {
  to { stroke-dashoffset: -100; }
}
@keyframes vt-halo {
  0%, 100% { opacity: 0.28; }
  50% { opacity: 0.7; }
}
@keyframes vt-core {
  0%, 100% { opacity: 0.7; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .vt--animated .vt-spine-draw,
  .vt--animated .vt-spine-flow,
  .vt--animated .vt-node-halo,
  .vt--animated .vt-node-core {
    animation: none !important;
  }
  .vt--animated .vt-spine-draw {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
  .vt--animated .vt-spine-flow {
    opacity: 0;
  }
  .vt--animated .vt-node-core {
    opacity: 1;
    transform: none;
  }
  .vt--animated .vt-motion,
  .vt--animated .vt-pulse {
    display: none;
  }
}
@media print {
  .vt--animated .vt-spine-draw,
  .vt--animated .vt-spine-flow,
  .vt--animated .vt-node-halo,
  .vt--animated .vt-node-core {
    animation: none !important;
  }
  .vt--animated .vt-spine-draw {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
  .vt--animated .vt-spine-flow {
    opacity: 0;
  }
  .vt--animated .vt-node-halo {
    opacity: 0.35;
  }
  .vt--animated .vt-node-core {
    opacity: 1;
    transform: none;
  }
  .vt--animated .vt-motion,
  .vt--animated .vt-pulse {
    display: none;
  }
}
`;

export default VerticalTimeline;
