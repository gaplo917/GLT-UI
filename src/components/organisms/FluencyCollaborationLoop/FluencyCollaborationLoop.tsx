/**
 * Fluency collaboration loop: Delegation → Description → Discernment → Diligence
 * as a closed human skill loop, with Index framing (human behaviors vs model polish).
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type FluencyLoopDimension = {
  id: string;
  n: string;
  label: string;
  detail: string;
  /** Brand highlight (typically Diligence). */
  tone?: "brand" | "neutral";
};

export type FluencyCollaborationLoopProps = {
  dimensions: readonly FluencyLoopDimension[];
  /** Center claim. */
  centerTitle?: string;
  centerSub?: string;
  /** Outer Index chip. */
  indexLabel?: string;
  /** Distinction strip under loop. */
  distinctionLabel?: string;
  returnLabel?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 360;

/**
 * Closed 4D fluency loop with Index human-behavior framing.
 */
export function FluencyCollaborationLoop({
  dimensions,
  centerTitle = "Human skill",
  centerSub = "not model polish alone",
  indexLabel = "Index · 24 behaviors · 11 chat-observable",
  distinctionLabel = "Measure what people do with models",
  returnLabel = "↻ next collaboration turn",
  cites,
  title = "",
  description = "",
  className,
}: FluencyCollaborationLoopProps) {
  if (dimensions.length < 3) return null;

  // Place dimensions around a diamond: top-left, top-right, bottom-right, bottom-left
  const order = dimensions.slice(0, 4);
  const cx = VB_W / 2;
  const cy = 168;
  const rx = 280;
  const ry = 96;
  // angles for 4 nodes: NW, NE, SE, SW (start top-left going clockwise from Delegation)
  const angles = [-150, -30, 30, 150].map((d) => (d * Math.PI) / 180);
  const nodes = order.map((dim, i) => {
    const a = angles[i] ?? 0;
    return {
      ...dim,
      x: cx + rx * Math.cos(a),
      y: cy + ry * Math.sin(a),
      tone: dim.tone ?? (i === order.length - 1 ? "brand" : "neutral"),
    };
  });

  const boxW = 168;
  const boxH = 64;
  const loopPath = (() => {
    const pts = nodes.map((n) => ({ x: n.x, y: n.y }));
    if (pts.length < 2) return "";
    const parts = [`M ${pts[0]!.x} ${pts[0]!.y}`];
    for (let i = 1; i < pts.length; i++) {
      parts.push(`L ${pts[i]!.x} ${pts[i]!.y}`);
    }
    parts.push(`L ${pts[0]!.x} ${pts[0]!.y}`);
    return parts.join(" ");
  })();

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

        {/* Outer index chip */}
        <rect
          x={cx - 200}
          y={12}
          width={400}
          height={26}
          rx={13}
          className="fcl-index-chip"
        />
        <text x={cx} y={26} textAnchor="middle" dominantBaseline="middle" className="fcl-index-text">
          {indexLabel}
        </text>

        {/* Loop track */}
        <path d={loopPath} className="fcl-track" fill="none" />
        <path d={loopPath} className="fcl-flow" fill="none" pathLength={100} />

        {/* Center */}
        <circle cx={cx} cy={cy} r={58} className="fcl-center" />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fcl-center-title">
          {centerTitle}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fcl-center-sub">
          {centerSub}
        </text>

        {/* Dimension cards */}
        {nodes.map((n) => (
          <g key={n.id} data-fcl-dim={n.id} transform={`translate(${n.x - boxW / 2} ${n.y - boxH / 2})`}>
            <rect
              width={boxW}
              height={boxH}
              rx={12}
              className={n.tone === "brand" ? "fcl-card fcl-card--brand" : "fcl-card"}
            />
            <text x={14} y={22} className="fcl-n">
              {n.n}
            </text>
            <text x={42} y={22} className={n.tone === "brand" ? "fcl-label fcl-label--brand" : "fcl-label"}>
              {n.label}
            </text>
            <text x={14} y={46} className="fcl-detail">
              {n.detail}
            </text>
          </g>
        ))}

        {/* Return / distinction */}
        <text x={cx} y={VB_H - 42} textAnchor="middle" className="fcl-return">
          {returnLabel}
        </text>
        <text x={cx} y={VB_H - 20} textAnchor="middle" className="fcl-distinction">
          {distinctionLabel}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={cx} y={VB_H - 6} fontSize={10} />
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
  stroke-linejoin: round;
  stroke-linecap: round;
}
.fcl-flow {
  stroke: var(--brand-primary);
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 18 82;
  animation: fcl-flow 3s linear infinite;
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
