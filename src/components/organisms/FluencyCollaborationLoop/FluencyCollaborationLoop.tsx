/**
 * 4D fluency as a closed oval loop. Cards sit outside the track; Diligence
 * returns ownership before the next engagement. Index chip frames measurement
 * as human behaviors, not model polish. One fluid animated SVG.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type FluencyLoopDimension = {
  id: string;
  n: string;
  label: string;
  detail: string;
  tone?: "brand" | "neutral";
};

export type FluencyCollaborationLoopProps = {
  dimensions: readonly FluencyLoopDimension[];
  centerTitle?: string;
  centerSub?: string;
  indexLabel?: string;
  distinctionLabel?: string;
  returnLabel?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 444;
const CX = 480;
const CY = 214;
const RX = 248;
const RY = 92;
const BOX_W = 176;
const BOX_H = 62;

export function FluencyCollaborationLoop({
  dimensions,
  centerTitle = "Human skill",
  centerSub = "not model polish alone",
  indexLabel = "Index · 24 behaviors · 11 chat-observable",
  distinctionLabel = "Measure what people do with models",
  returnLabel = "Diligence returns ownership · next turn",
  cites,
  title = "",
  description = "",
  className,
}: FluencyCollaborationLoopProps) {
  if (dimensions.length < 3) return null;

  const order = dimensions.slice(0, 4);
  // N, E, S, W — cards sit outside the oval
  const slots = [
    { x: CX, y: CY - RY - 46, anchor: "middle" as const },
    { x: CX + RX + 8, y: CY, anchor: "start" as const },
    { x: CX, y: CY + RY + 54, anchor: "middle" as const },
    { x: CX - RX - 8, y: CY, anchor: "end" as const },
  ];
  const nodes = order.map((dim, i) => {
    const slot = slots[i] ?? slots[0]!;
    const left =
      slot.anchor === "middle"
        ? slot.x - BOX_W / 2
        : slot.anchor === "start"
          ? slot.x
          : slot.x - BOX_W;
    return {
      ...dim,
      left,
      top: slot.y - BOX_H / 2,
      tone: dim.tone ?? (i === order.length - 1 ? "brand" : "neutral"),
    };
  });

  const oval = `M ${CX - RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX + RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX - RX} ${CY}`;

  return (
    <div
      className={["fcl w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="fluency-collaboration-loop"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "fcl-title fcl-desc" : undefined}
        aria-label={!title && !description ? "Fluency collaboration loop" : undefined}
      >
        <title id="fcl-title">{title}</title>
        <desc id="fcl-desc">{description}</desc>

        <rect
          x={CX - 210}
          y={10}
          width={420}
          height={26}
          rx={13}
          className="fcl-index-chip"
        />
        <text
          x={CX}
          y={24}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fcl-index-text"
        >
          {indexLabel}
        </text>

        <ellipse
          cx={CX}
          cy={CY}
          rx={RX}
          ry={RY}
          className="fcl-track"
          fill="none"
        />
        <path d={oval} className="fcl-flow" fill="none" pathLength={100} />

        {/* Elbow ticks from oval to cards */}
        <path
          d={`M ${CX} ${CY - RY} V ${CY - RY - 14}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX + RX} ${CY} H ${CX + RX + 8}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX} ${CY + RY} V ${CY + RY + 14}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX - RX} ${CY} H ${CX - RX - 8}`}
          className="fcl-elbow"
        />

        <circle cx={CX} cy={CY} r={56} className="fcl-center" />
        <text x={CX} y={CY - 8} textAnchor="middle" className="fcl-center-title">
          {centerTitle}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" className="fcl-center-sub">
          {centerSub}
        </text>

        {nodes.map((n) => (
          <g
            key={n.id}
            data-fcl-dim={n.id}
            transform={`translate(${n.left} ${n.top})`}
          >
            <rect
              width={BOX_W}
              height={BOX_H}
              rx={12}
              className={n.tone === "brand" ? "fcl-card fcl-card--brand" : "fcl-card"}
            />
            <text x={14} y={22} className="fcl-n">
              {n.n}
            </text>
            <text
              x={40}
              y={22}
              className={n.tone === "brand" ? "fcl-label fcl-label--brand" : "fcl-label"}
            >
              {n.label}
            </text>
            <text x={14} y={44} className="fcl-detail">
              {n.detail}
            </text>
          </g>
        ))}

        <text x={CX} y={VB_H - 28} textAnchor="middle" className="fcl-return">
          {returnLabel}
        </text>
        <text x={CX} y={VB_H - 12} textAnchor="middle" className="fcl-distinction">
          {distinctionLabel}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={CX} y={VB_H - 2} fontSize={10} />
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.fcl-index-chip {
  fill: color-mix(in srgb, var(--brand-primary) 10%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 40%, var(--border-color));
  stroke-width: 1;
}
.fcl-index-text {
  fill: var(--brand-primary);
  font-size: 11.5px;
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.03em;
}
.fcl-track {
  stroke: var(--border-color);
  stroke-width: 3;
}
.fcl-flow {
  stroke: var(--brand-primary);
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 16 84;
  animation: fcl-flow 3.2s linear infinite;
}
.fcl-elbow {
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-linecap: square;
}
.fcl-center {
  fill: color-mix(in srgb, var(--card-bg-color) 90%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1.5;
}
.fcl-center-title {
  fill: var(--strong-text-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.fcl-center-sub {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-family), system-ui, sans-serif;
}
.fcl-card {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.5;
}
.fcl-card--brand {
  stroke: var(--brand-primary);
  stroke-width: 2;
}
.fcl-n {
  fill: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.fcl-label {
  fill: var(--strong-text-color);
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.fcl-label--brand { fill: var(--brand-primary); }
.fcl-detail {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-family), system-ui, sans-serif;
}
.fcl-return {
  fill: var(--brand-primary);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.fcl-distinction {
  fill: var(--secondary-text-color);
  font-size: 12px;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes fcl-flow { to { stroke-dashoffset: -100; } }
@media (prefers-reduced-motion: reduce) {
  .fcl-flow { animation: none !important; stroke-dasharray: none; }
}
`;

export default FluencyCollaborationLoop;
