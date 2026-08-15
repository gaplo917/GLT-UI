/**
 * 4D fluency as a closed oval loop. Cards sit outside the track with a
 * visible gap from the Index chip, oval, and footer. Diligence returns
 * ownership before the next engagement. One fluid animated SVG.
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
const VB_H = 540;
const CX = 480;
const CY = 268;
const RX = 228;
const RY = 82;
const BOX_W = 188;
const BOX_H = 66;
const CHIP_Y = 10;
const CHIP_H = 28;
const CARD_GAP = 58;
const ARROW_LEN = 8;
const ARROW_HALF = 3.1;
/** Visual radians from +x; parametric 45° sits on the flat sides. */
const ARROW_VISUAL = [deg(-60), deg(30), deg(120), deg(210)];

function deg(d: number): number {
  return (d * Math.PI) / 180;
}

/** Clockwise ellipse point. θ=0 is east; SVG y increases downward. */
function ovalPoint(theta: number): { x: number; y: number } {
  return {
    x: CX + RX * Math.cos(theta),
    y: CY + RY * Math.sin(theta),
  };
}

/** Parametric θ for a visual angle φ from the +x axis. */
function visualToParametric(phi: number): number {
  return Math.atan2(RX * Math.sin(phi), RY * Math.cos(phi));
}

/** Clockwise unit tangent at θ. */
function ovalTangent(theta: number): { x: number; y: number } {
  const dx = -RX * Math.sin(theta);
  const dy = RY * Math.cos(theta);
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function arrowHead(theta: number): string {
  const p = ovalPoint(theta);
  const t = ovalTangent(theta);
  const nx = -t.y;
  const ny = t.x;
  const tipX = p.x + t.x * ARROW_LEN;
  const tipY = p.y + t.y * ARROW_LEN;
  const baseX = p.x - t.x * ARROW_LEN * 0.28;
  const baseY = p.y - t.y * ARROW_LEN * 0.28;
  return `M ${tipX.toFixed(1)} ${tipY.toFixed(1)} L ${(baseX + nx * ARROW_HALF).toFixed(1)} ${(baseY + ny * ARROW_HALF).toFixed(1)} L ${(baseX - nx * ARROW_HALF).toFixed(1)} ${(baseY - ny * ARROW_HALF).toFixed(1)} Z`;
}

function wrapDetail(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

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
  const slots = [
    { x: CX, y: CY - RY - CARD_GAP, anchor: "middle" as const },
    { x: CX + RX + 18, y: CY, anchor: "start" as const },
    { x: CX, y: CY + RY + CARD_GAP, anchor: "middle" as const },
    { x: CX - RX - 18, y: CY, anchor: "end" as const },
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

  const north = nodes[0]!;
  const east = nodes[1]!;
  const south = nodes[2]!;
  const west = nodes[3] ?? nodes[0]!;

  const oval = `M ${CX - RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX + RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX - RX} ${CY}`;
  const flowThetas = ARROW_VISUAL.map(visualToParametric);
  const chipW = Math.min(520, Math.max(360, indexLabel.length * 8.2));

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
          x={CX - chipW / 2}
          y={CHIP_Y}
          width={chipW}
          height={CHIP_H}
          rx={14}
          className="fcl-index-chip"
          data-fcl-chip="index"
        />
        <text
          x={CX}
          y={CHIP_Y + CHIP_H / 2}
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
        <path d={oval} className="fcl-flow" fill="none" />
        {flowThetas.map((theta) => (
          <path
            key={`arr-${theta}`}
            d={arrowHead(theta)}
            className="fcl-arrow"
          />
        ))}

        <path
          d={`M ${CX} ${CY - RY} V ${north.top + BOX_H}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX + RX} ${CY} H ${east.left}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX} ${CY + RY} V ${south.top}`}
          className="fcl-elbow"
        />
        <path
          d={`M ${CX - RX} ${CY} H ${west.left + BOX_W}`}
          className="fcl-elbow"
        />

        <circle cx={CX} cy={CY} r={66} className="fcl-center" />
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
            <text x={14} y={42} className="fcl-detail">
              {wrapDetail(n.detail, 26).map((line, li) => (
                <tspan key={`${n.id}-d-${li}`} x={14} dy={li === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        <text x={CX} y={VB_H - 36} textAnchor="middle" className="fcl-return">
          {returnLabel}
        </text>
        <text x={CX} y={VB_H - 20} textAnchor="middle" className="fcl-distinction">
          {distinctionLabel}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={CX} y={VB_H - 6} fontSize={10} />
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
  stroke-dasharray: 10 8;
  animation: fcl-flow 3.2s linear infinite;
}
.fcl-arrow { fill: var(--brand-primary); }
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
