/**
 * Mediation architecture: first-party AI-code share on a time axis while a
 * human accept gate stays in the loop. Supports a single in-window snapshot or
 * multiple ladders. Optional chips for a different unit (tokens, share of work).
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type MediationRiseLevel = {
  id: string;
  value: string;
  period: string;
  share: number;
  /** 0–1 time placement on the shared axis. Falls back to series index. */
  t?: number;
  citeKey?: string;
};

export type MediationRiseSeries = {
  id: string;
  label: string;
  levels: readonly MediationRiseLevel[];
};

export type MediationRiseChip = {
  id: string;
  label: string;
  value: string;
  citeKey?: string;
};

export type MediationRiseDiagramProps = {
  /** Single-series fallback (presentation decks). */
  levels?: readonly MediationRiseLevel[];
  /** Dual (or more) first-party ladders on one time axis. */
  series?: readonly MediationRiseSeries[];
  /** Side metrics in a different unit (not plotted as a line). */
  chips?: readonly MediationRiseChip[];
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  timeLabel?: string;
  shareLabel?: string;
  gateLabel?: string;
  thresholdLabel?: string;
  thresholdShare?: number;
  claim?: string;
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 420;
const PAD_L = 72;
const PAD_R = 88;
const PAD_T = 56;
const PAD_B = 78;

function yForShare(share: number, maxShare: number): number {
  const plotH = VB_H - PAD_T - PAD_B;
  const s = Math.min(Math.max(share, 0), maxShare);
  return PAD_T + plotH * (1 - s / maxShare);
}

function resolveSeries(
  series: readonly MediationRiseSeries[] | undefined,
  levels: readonly MediationRiseLevel[] | undefined,
): MediationRiseSeries[] {
  if (series && series.length > 0) return [...series];
  if (levels && levels.length >= 2) {
    return [{ id: "primary", label: "Public series", levels }];
  }
  return [];
}

export function MediationRiseDiagram({
  levels,
  series,
  chips,
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
  const resolved = resolveSeries(series, levels);
  if (resolved.length === 0) return null;

  const allLevels = resolved.flatMap((s) => s.levels);
  const maxShare = Math.max(
    100,
    ...allLevels.map((l) => l.share),
    thresholdShare + 10,
  );
  const plotW = VB_W - PAD_L - PAD_R;
  const showCites = Boolean(cites);
  const thrY = yForShare(thresholdShare, maxShare);

  const plotted = resolved.map((s, si) => {
    const n = s.levels.length;
    const pts = s.levels.map((l, i) => {
      const t = typeof l.t === "number" ? l.t : n === 1 ? 0.5 : i / (n - 1);
      const x = PAD_L + Math.min(1, Math.max(0, t)) * plotW;
      return { ...l, x, y: yForShare(l.share, maxShare), seriesIndex: si };
    });
    const pathD = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
    return { ...s, pts, pathD, seriesIndex: si };
  });

  const chipRow = chips ?? [];

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

        <text x={PAD_L} y={22} className="mrd-claim">
          {claim}
        </text>

        {chipRow.map((ch, i) => {
          const x = VB_W - PAD_R - 168 - i * 180;
          const tileCites = ch.citeKey ? cites?.[ch.citeKey] : undefined;
          return (
            <g key={ch.id} data-mrd-chip={ch.id}>
              <rect x={x} y={8} width={168} height={28} rx={8} className="mrd-chip" />
              <text x={x + 10} y={18} className="mrd-chip-k">
                {ch.label}
              </text>
              <text x={x + 10} y={30} className="mrd-chip-v">
                {ch.value}
              </text>
              {showCites && tileCites && tileCites.length > 0 ? (
                <SvgRefCite items={tileCites} x={x + 148} y={22} fontSize={9} />
              ) : null}
            </g>
          );
        })}

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
          y={VB_H - 12}
          textAnchor="middle"
          className="mrd-axis-label"
        >
          {timeLabel}
        </text>

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
          width={Math.min(400, plotW - 16)}
          height={20}
          rx={6}
          className="mrd-threshold-chip"
        />
        <text x={PAD_L + 18} y={thrY - 8} className="mrd-threshold-text">
          {thresholdLabel}
        </text>

        <rect
          x={PAD_L + plotW / 2 - 92}
          y={VB_H - PAD_B - 34}
          width={184}
          height={20}
          rx={10}
          className="mrd-gate"
        />
        <text
          x={PAD_L + plotW / 2}
          y={VB_H - PAD_B - 23}
          textAnchor="middle"
          dominantBaseline="middle"
          className="mrd-gate-text"
        >
          {gateLabel}
        </text>

        {plotted.map((s) => (
          <g key={s.id} data-mrd-series={s.id}>
            <path
              d={s.pathD}
              className={s.seriesIndex === 0 ? "mrd-path-track" : "mrd-path-track mrd-path-track--b"}
              fill="none"
            />
            <path
              d={s.pathD}
              className={s.seriesIndex === 0 ? "mrd-path-flow" : "mrd-path-flow mrd-path-flow--b"}
              fill="none"
              pathLength={100}
            />
            {s.pts.map((p, i) => {
              const tileCites = p.citeKey ? cites?.[p.citeKey] : undefined;
              const edge =
                s.pts.length === 1
                  ? "middle"
                  : i === 0
                    ? "start"
                    : i === s.pts.length - 1
                      ? "end"
                      : "middle";
              const periodY = VB_H - PAD_B + 16 + s.seriesIndex * 16;
              const periodX =
                edge === "start" ? p.x - 2 : edge === "end" ? p.x + 2 : p.x;
              return (
                <g key={`${s.id}-${p.id}`} data-mrd-level={p.id}>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x}
                    y2={VB_H - PAD_B}
                    className="mrd-drop"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={10}
                    className={
                      s.seriesIndex === 0 ? "mrd-node-ring" : "mrd-node-ring mrd-node-ring--b"
                    }
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    className={
                      s.seriesIndex === 0 ? "mrd-node-core" : "mrd-node-core mrd-node-core--b"
                    }
                  />
                  <text
                    x={p.x}
                    y={p.y - 16}
                    textAnchor="middle"
                    className={s.seriesIndex === 0 ? "mrd-value" : "mrd-value mrd-value--b"}
                  >
                    {p.value}
                  </text>
                  <text
                    x={periodX}
                    y={periodY}
                    textAnchor={edge}
                    className={s.seriesIndex === 0 ? "mrd-period" : "mrd-period mrd-period--b"}
                  >
                    {p.period}
                  </text>
                  {showCites && tileCites && tileCites.length > 0 ? (
                    <SvgRefCite
                      items={tileCites}
                      x={p.x}
                      y={periodY + 12}
                      fontSize={9}
                    />
                  ) : null}
                </g>
              );
            })}
          </g>
        ))}

        {plotted.map((s, i) => (
          <g key={`leg-${s.id}`}>
            <line
              x1={PAD_L + i * 280}
              y1={PAD_T - 18}
              x2={PAD_L + 22 + i * 280}
              y2={PAD_T - 18}
              className={i === 0 ? "mrd-path-flow" : "mrd-path-flow mrd-path-flow--b"}
            />
            <text x={PAD_L + 28 + i * 280} y={PAD_T - 14} className="mrd-legend">
              {s.label}
            </text>
          </g>
        ))}
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
.mrd-legend {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-family), system-ui, sans-serif;
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
  stroke-width: 3.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.mrd-path-track--b { stroke-width: 2.75; }
.mrd-path-flow {
  stroke: var(--brand-primary);
  stroke-width: 3.25;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 14 86;
  animation: mrd-flow 2.6s linear infinite;
}
.mrd-path-flow--b {
  stroke: color-mix(in srgb, var(--brand-primary) 50%, var(--strong-text-color));
  stroke-width: 2.75;
  stroke-dasharray: 8 10;
  animation-duration: 3.1s;
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
.mrd-node-ring--b {
  stroke: color-mix(in srgb, var(--brand-primary) 50%, var(--strong-text-color));
}
.mrd-node-core {
  fill: var(--brand-primary);
  animation: mrd-pulse 2.2s ease-in-out infinite;
}
.mrd-node-core--b {
  fill: color-mix(in srgb, var(--brand-primary) 50%, var(--strong-text-color));
}
.mrd-value {
  fill: var(--strong-text-color);
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-value--b { font-size: 13px; }
.mrd-period {
  fill: var(--secondary-text-color);
  font-size: 10.5px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-period--b { font-size: 10px; }
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
.mrd-chip {
  fill: color-mix(in srgb, var(--card-bg-color) 85%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1;
}
.mrd-chip-k {
  fill: var(--secondary-text-color);
  font-size: 9.5px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-chip-v {
  fill: var(--strong-text-color);
  font-size: 11.5px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes mrd-flow { to { stroke-dashoffset: -100; } }
@keyframes mrd-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .mrd-path-flow, .mrd-node-core { animation: none !important; }
  .mrd-path-flow { stroke-dasharray: none; }
}
`;

export default MediationRiseDiagram;
