/**
 * Mediation rise diagram: eng-accepted AI code share climbs a ladder while a
 * human-accept gate stays in the loop. Encodes “AI-mediated production” as
 * rising share + permanent review, not raw model draft volume alone.
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type MediationRiseLevel = {
  id: string;
  /** Display value e.g. ">25%", "~50%", "75%". */
  value: string;
  /** Short period label e.g. "Q3 2024". */
  period: string;
  /** Numeric share 0–100 for vertical placement. */
  share: number;
  citeKey?: string;
};

export type MediationRiseDiagramProps = {
  levels: readonly MediationRiseLevel[];
  /** Per-level sources keyed by citeKey (article). Presentation omits. */
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  /** Horizontal axis label. */
  timeLabel?: string;
  /** Vertical axis label. */
  shareLabel?: string;
  /** Gate chip under the rising path. */
  gateLabel?: string;
  /** Threshold callout when share crosses majority. */
  thresholdLabel?: string;
  /** Threshold share (default 50). */
  thresholdShare?: number;
  claim?: string;
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 340;
const PAD_L = 72;
const PAD_R = 36;
const PAD_T = 36;
const PAD_B = 56;

function yForShare(share: number, maxShare: number): number {
  const plotH = VB_H - PAD_T - PAD_B;
  const s = Math.min(Math.max(share, 0), maxShare);
  return PAD_T + plotH * (1 - s / maxShare);
}

/**
 * Rising eng-accepted AI code share with human-accept gate and fluency threshold.
 */
export function MediationRiseDiagram({
  levels,
  cites,
  timeLabel = "Public milestones",
  shareLabel = "Eng-accepted AI share",
  gateLabel = "Engineer accept gate",
  thresholdLabel = "Majority · fluency becomes first-order skill",
  thresholdShare = 50,
  claim = "Mediation rises. Review stays human.",
  title = "",
  description = "",
  className,
}: MediationRiseDiagramProps) {
  if (levels.length < 2) return null;

  const maxShare = Math.max(100, ...levels.map((l) => l.share), thresholdShare + 10);
  const plotW = VB_W - PAD_L - PAD_R;
  const xs = levels.map((_, i) =>
    PAD_L + (levels.length === 1 ? plotW / 2 : (i / (levels.length - 1)) * plotW),
  );
  const pts = levels.map((l, i) => ({
    ...l,
    x: xs[i]!,
    y: yForShare(l.share, maxShare),
  }));
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const thrY = yForShare(thresholdShare, maxShare);
  const showCites = Boolean(cites);

  return (
    <div
      className={["mrd w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="mediation-rise"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "mrd-title mrd-desc" : undefined}
        aria-label={!title && !description ? "Mediation rise diagram" : undefined}
      >
        <title id="mrd-title">{title}</title>
        <desc id="mrd-desc">{description}</desc>

        {/* Axes */}
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={VB_H - PAD_B}
          className="mrd-axis"
        />
        <line
          x1={PAD_L}
          y1={VB_H - PAD_B}
          x2={VB_W - PAD_R}
          y2={VB_H - PAD_B}
          className="mrd-axis"
        />
        <text
          x={18}
          y={(PAD_T + VB_H - PAD_B) / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${(PAD_T + VB_H - PAD_B) / 2})`}
          className="mrd-axis-label"
        >
          {shareLabel}
        </text>
        <text
          x={(PAD_L + VB_W - PAD_R) / 2}
          y={VB_H - 14}
          textAnchor="middle"
          className="mrd-axis-label"
        >
          {timeLabel}
        </text>

        {/* Threshold band */}
        <line
          x1={PAD_L}
          y1={thrY}
          x2={VB_W - PAD_R}
          y2={thrY}
          className="mrd-threshold"
        />
        <rect
          x={PAD_L + 8}
          y={thrY - 22}
          width={Math.min(420, plotW - 16)}
          height={20}
          rx={6}
          className="mrd-threshold-chip"
        />
        <text
          x={PAD_L + 18}
          y={thrY - 8}
          className="mrd-threshold-text"
        >
          {thresholdLabel}
        </text>

        {/* Rising path */}
        <path d={pathD} className="mrd-path-track" fill="none" />
        <path d={pathD} className="mrd-path-flow" fill="none" pathLength={100} />

        {/* Human accept gate under path */}
        <rect
          x={PAD_L + plotW / 2 - 90}
          y={VB_H - PAD_B - 36}
          width={180}
          height={22}
          rx={11}
          className="mrd-gate"
        />
        <text
          x={PAD_L + plotW / 2}
          y={VB_H - PAD_B - 21}
          textAnchor="middle"
          dominantBaseline="middle"
          className="mrd-gate-text"
        >
          {gateLabel}
        </text>

        {/* Milestones */}
        {pts.map((p) => {
          const tileCites = p.citeKey ? cites?.[p.citeKey] : undefined;
          return (
            <g key={p.id} data-mrd-level={p.id}>
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={VB_H - PAD_B}
                className="mrd-drop"
              />
              <circle cx={p.x} cy={p.y} r={11} className="mrd-node-ring" />
              <circle cx={p.x} cy={p.y} r={5.5} className="mrd-node-core" />
              <text x={p.x} y={p.y - 22} textAnchor="middle" className="mrd-value">
                {p.value}
              </text>
              <text x={p.x} y={VB_H - PAD_B + 16} textAnchor="middle" className="mrd-period">
                {p.period}
              </text>
              {showCites && tileCites && tileCites.length > 0 ? (
                <SvgRefCite items={tileCites} x={p.x} y={VB_H - PAD_B + 30} fontSize={10} />
              ) : null}
            </g>
          );
        })}

        {/* Claim */}
        <text x={VB_W - PAD_R} y={PAD_T + 4} textAnchor="end" className="mrd-claim">
          {claim}
        </text>
      </svg>
    </div>
  );
}

const css = `
.mrd-axis { stroke: var(--border-color); stroke-width: 1.5; }
.mrd-axis-label {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.04em;
}
.mrd-threshold {
  stroke: color-mix(in srgb, var(--brand-primary) 55%, var(--border-color));
  stroke-width: 1.25;
  stroke-dasharray: 5 5;
}
.mrd-threshold-chip {
  fill: color-mix(in srgb, var(--brand-primary) 12%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 35%, var(--border-color));
  stroke-width: 1;
}
.mrd-threshold-text {
  fill: var(--brand-primary);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-path-track {
  stroke: var(--border-color);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.mrd-path-flow {
  stroke: var(--brand-primary);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 14 86;
  animation: mrd-flow 2.6s linear infinite;
}
.mrd-drop {
  stroke: color-mix(in srgb, var(--border-color) 70%, transparent);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}
.mrd-node-ring {
  fill: var(--bg-color);
  stroke: var(--brand-primary);
  stroke-width: 2.25;
}
.mrd-node-core {
  fill: var(--brand-primary);
  animation: mrd-pulse 2.2s ease-in-out infinite;
}
.mrd-value {
  fill: var(--strong-text-color);
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-period {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-gate {
  fill: color-mix(in srgb, var(--card-bg-color) 80%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1;
}
.mrd-gate-text {
  fill: var(--secondary-text-color);
  font-size: 10.5px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-claim {
  fill: var(--secondary-text-color);
  font-size: 12px;
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes mrd-flow { to { stroke-dashoffset: -100; } }
@keyframes mrd-pulse {
  0%, 100% { opacity: 0.7; r: 5; }
  50% { opacity: 1; r: 6.5; }
}
@media (prefers-reduced-motion: reduce) {
  .mrd-path-flow, .mrd-node-core { animation: none !important; }
  .mrd-path-flow { stroke-dasharray: none; }
}
`;

export default MediationRiseDiagram;
