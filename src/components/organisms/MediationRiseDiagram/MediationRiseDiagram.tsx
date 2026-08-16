/**
 * Engineer-accepted AI code-share ladder on a 2024–now time axis.
 * Incompatible units share the calendar as a second-color point.
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";
import { wrapLines } from "@/components/organisms/MultiModePolicyBand/wrapLines.js";

export type MediationRiseLevel = {
  id: string;
  value: string;
  period: string;
  share: number;
  /** ISO date (YYYY-MM-DD) that places the point on the calendar axis. */
  at?: string;
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
  /** When set with `at`, the chip plots on the calendar instead of a side card. */
  share?: number;
  at?: string;
  period?: string;
  citeKey?: string;
};

export type MediationRiseDiagramProps = {
  levels?: readonly MediationRiseLevel[];
  series?: readonly MediationRiseSeries[];
  chips?: readonly MediationRiseChip[];
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  timeLabel?: string;
  shareLabel?: string;
  gateLabel?: string;
  thresholdLabel?: string;
  thresholdShare?: number;
  claim?: string;
  /** ISO date that ends the calendar axis (time projection). */
  horizonAt?: string;
  projectionLabel?: string;
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 480;
const PLOT_L = 88;
const PLOT_T = 76;
const PLOT_B = 336;
const TICKS = [0, 25, 50, 75, 100] as const;

function resolveSeries(
  series: readonly MediationRiseSeries[] | undefined,
  levels: readonly MediationRiseLevel[] | undefined,
): MediationRiseSeries[] {
  if (series?.length) return [...series];
  if (levels?.length) return [{ id: "primary", label: "Public series", levels }];
  return [];
}

function utcDay(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function plotX(t: number, left: number, right: number): number {
  return left + t * (right - left);
}

function yearTicks(startMs: number, endMs: number): { year: number; ms: number }[] {
  const startYear = new Date(startMs).getUTCFullYear();
  const endYear = new Date(endMs).getUTCFullYear();
  const ticks: { year: number; ms: number }[] = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const ms = Date.UTC(year, 0, 1);
    if (ms >= startMs && ms <= endMs) ticks.push({ year, ms });
  }
  return ticks;
}

function plotY(share: number): number {
  const clamped = Math.min(100, Math.max(0, share));
  return PLOT_B - (clamped / 100) * (PLOT_B - PLOT_T);
}

export function MediationRiseDiagram({
  levels,
  series,
  chips,
  cites,
  timeLabel = "First-party public milestones",
  shareLabel = "Engineer-accepted AI share",
  gateLabel = "Human accept / review gate",
  thresholdLabel = "Majority threshold",
  thresholdShare = 50,
  claim = "Mediation rises. Review stays human.",
  horizonAt,
  projectionLabel = "Projection",
  title = "",
  description = "",
  className,
}: MediationRiseDiagramProps) {
  const resolved = resolveSeries(series, levels);
  if (!resolved.length) return null;

  const primary = resolved[0]!;
  const n = primary.levels.length;
  if (n < 1) return null;

  const allChips = chips ?? [];
  const plotChips = allChips.filter(
    (chip): chip is MediationRiseChip & { share: number; at: string } =>
      chip.share != null && Boolean(chip.at),
  );
  const cardChips = allChips.filter((chip) => chip.share == null || !chip.at);
  const plotR = cardChips.length > 0 ? 638 : 908;
  const x0 = PLOT_L + 18;
  const x1 = plotR - 18;
  const dated = primary.levels.map((level, i) => ({
    ...level,
    ms: level.at ? utcDay(level.at) : null,
    fallbackT: n === 1 ? 0.5 : i / (n - 1),
  }));
  const compareDated = plotChips.map((chip) => ({
    ...chip,
    ms: utcDay(chip.at),
  }));
  const primaryMs = dated.map((d) => d.ms).filter((ms): ms is number => ms != null);
  const compareMs = compareDated
    .map((d) => d.ms)
    .filter((ms): ms is number => ms != null);
  const knownMs = [...primaryMs, ...compareMs];
  const horizonMs = horizonAt ? utcDay(horizonAt) : null;
  const startMs = knownMs.length ? Math.min(...knownMs) : 0;
  const lastPrimaryMs = primaryMs.length ? Math.max(...primaryMs) : 0;
  const lastObsMs = knownMs.length ? Math.max(...knownMs) : 0;
  const endMs =
    horizonMs != null && horizonMs > lastPrimaryMs
      ? Math.max(horizonMs, lastObsMs)
      : lastObsMs || 1;
  const span = Math.max(1, endMs - startMs);
  const points = dated.map((level) => {
    const t =
      level.ms != null ? (level.ms - startMs) / span : level.fallbackT;
    return {
      ...level,
      x: plotX(t, x0, x1),
      y: plotY(level.share),
    };
  });
  const comparePoints = compareDated.map((chip) => {
    const t = chip.ms != null ? (chip.ms - startMs) / span : 1;
    return {
      ...chip,
      x: plotX(t, x0, x1),
      y: plotY(chip.share),
    };
  });
  const last = points[points.length - 1];
  const prev = points.length > 1 ? points[points.length - 2] : null;
  const projT = 1;
  const projX = plotX(projT, x0, x1);
  let projY: number | null = null;
  if (
    last &&
    prev &&
    last.ms != null &&
    prev.ms != null &&
    last.ms > prev.ms &&
    endMs > last.ms
  ) {
    const slope = (last.share - prev.share) / (last.ms - prev.ms);
    projY = plotY(last.share + slope * (endMs - last.ms));
  }

  const lineD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaD =
    points.length > 0
      ? `${lineD} L ${points[points.length - 1]!.x.toFixed(1)} ${PLOT_B} L ${points[0]!.x.toFixed(1)} ${PLOT_B} Z`
      : "";
  const threshY = plotY(thresholdShare);
  const years = knownMs.length ? yearTicks(startMs, endMs) : [];

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
        aria-label={
          !title && !description ? "Engineer-accepted AI code share over time" : undefined
        }
      >
        <title id="mrd-title">{title}</title>
        <desc id="mrd-desc">{description}</desc>

        <text x={28} y={28} className="mrd-eyebrow">
          Observed production mediation
        </text>
        <text x={28} y={52} className="mrd-claim">
          {claim}
        </text>
        <rect
          x={VB_W - 318}
          y={12}
          width={290}
          height={52}
          rx={12}
          className="mrd-threshold-chip"
        />
        <text x={VB_W - 304} y={30} className="mrd-threshold-kicker">
          {wrapLines(thresholdLabel, 28, 2).map((line, li) => (
            <tspan key={`th-${li}`} x={VB_W - 304} dy={li === 0 ? 0 : 16}>
              {line}
            </tspan>
          ))}
        </text>
        <text x={VB_W - 64} y={40} textAnchor="end" className="mrd-threshold-value">
          {thresholdShare}%
        </text>

        <text
          x={22}
          y={(PLOT_T + PLOT_B) / 2}
          textAnchor="middle"
          transform={`rotate(-90 22 ${(PLOT_T + PLOT_B) / 2})`}
          className="mrd-axis-title"
        >
          {shareLabel}
        </text>

        {TICKS.map((tick) => {
          const y = plotY(tick);
          return (
            <g key={`tick-${tick}`}>
              <path
                d={`M ${PLOT_L} ${y} H ${plotR}`}
                className={
                  tick === thresholdShare ? "mrd-grid mrd-grid--major" : "mrd-grid"
                }
              />
              <text x={PLOT_L - 10} y={y} textAnchor="end" dominantBaseline="middle" className="mrd-tick">
                {tick}%
              </text>
            </g>
          );
        })}

        <path
          d={`M ${PLOT_L} ${threshY} H ${plotR}`}
          className="mrd-threshold-line"
        />

        <path d={areaD} className="mrd-area" />
        <path d={lineD} className="mrd-line" fill="none" />
        {last && projY != null ? (
          <g data-mrd-projection="">
            <path
              d={`M ${last.x.toFixed(1)} ${last.y.toFixed(1)} L ${projX.toFixed(1)} ${projY.toFixed(1)}`}
              className="mrd-projection"
              fill="none"
            />
            <circle cx={projX} cy={projY} r={4} className="mrd-projection-point" />
            <text
              x={((last.x + projX) / 2).toFixed(1)}
              y={((last.y + projY) / 2 - 12).toFixed(1)}
              textAnchor="middle"
              className="mrd-projection-label"
            >
              {projectionLabel}
            </text>
          </g>
        ) : null}

        {years.map((tick) => {
          const x = plotX((tick.ms - startMs) / span, x0, x1);
          return (
            <g key={`year-${tick.year}`} data-mrd-year={tick.year}>
              <path d={`M ${x} ${PLOT_B} V ${PLOT_B + 6}`} className="mrd-year-tick" />
              <text
                x={x}
                y={PLOT_B + 18}
                textAnchor="middle"
                className="mrd-year-label"
              >
                {tick.year}
              </text>
            </g>
          );
        })}

        {points.map((p) => {
          const valueAbove = p.y > PLOT_T + 48;
          const valueY = valueAbove ? p.y - 36 : p.y + 26;
          const periodY = valueAbove ? p.y - 18 : p.y + 44;
          const citeX = Math.min(plotR - 16, p.x + 28);
          const citeItemsForPoint = p.citeKey ? cites?.[p.citeKey] : undefined;
          return (
            <g key={p.id} data-mrd-level={p.id}>
              <circle cx={p.x} cy={p.y} r={11} className="mrd-point-ring" />
              <circle cx={p.x} cy={p.y} r={5.5} className="mrd-point" />
              <text
                x={p.x}
                y={valueY}
                textAnchor="middle"
                className="mrd-point-value"
              >
                {p.value}
              </text>
              {p.period ? (
                <text
                  x={p.x}
                  y={periodY}
                  textAnchor="middle"
                  className="mrd-point-period"
                >
                  {p.period}
                </text>
              ) : null}
              {citeItemsForPoint && citeItemsForPoint.length > 0 ? (
                <SvgRefCite items={citeItemsForPoint} x={citeX} y={p.y} fontSize={14} />
              ) : null}
            </g>
          );
        })}

        {comparePoints.map((p) => {
          const labelX = p.x + 18;
          const valueY = p.y - 8;
          const periodY = p.y + 10;
          const citeX = Math.min(plotR - 16, labelX + 54);
          const citeItemsForPoint = p.citeKey ? cites?.[p.citeKey] : undefined;
          return (
            <g key={p.id} data-mrd-chip={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={11}
                className="mrd-point-ring mrd-point-ring--compare"
              />
              <circle cx={p.x} cy={p.y} r={5.5} className="mrd-point mrd-point--compare" />
              <text
                x={labelX}
                y={valueY}
                className="mrd-point-value mrd-point-value--compare"
              >
                {p.value}
              </text>
              {p.period ? (
                <text
                  x={labelX}
                  y={periodY}
                  className="mrd-point-period mrd-point-period--compare"
                >
                  {p.period}
                </text>
              ) : null}
              {citeItemsForPoint && citeItemsForPoint.length > 0 ? (
                <SvgRefCite items={citeItemsForPoint} x={citeX} y={valueY} fontSize={14} />
              ) : null}
            </g>
          );
        })}

        <text x={(PLOT_L + plotR) / 2} y={PLOT_B + 36} textAnchor="middle" className="mrd-time-label">
          {timeLabel}
        </text>
        <g className="mrd-legend">
          <circle cx={PLOT_L + 16} cy={PLOT_T + 16} r={5} className="mrd-point" />
          <text x={PLOT_L + 28} y={PLOT_T + 20} className="mrd-series-label">
            {primary.label}
          </text>
          {comparePoints.map((chip, i) => (
            <g key={`legend-${chip.id}`}>
              <circle
                cx={PLOT_L + 16}
                cy={PLOT_T + 36 + i * 20}
                r={5}
                className="mrd-point mrd-point--compare"
              />
              <text
                x={PLOT_L + 28}
                y={PLOT_T + 40 + i * 20}
                className="mrd-series-label mrd-series-label--compare"
              >
                {chip.label}
              </text>
            </g>
          ))}
        </g>

        {cardChips.map((chip, i) => {
          const y = 92 + i * 168;
          const chipCites = chip.citeKey ? cites?.[chip.citeKey] : undefined;
          return (
            <g key={chip.id} data-mrd-chip={chip.id}>
              <path
                d={`M ${plotR + 8} ${threshY} H ${plotR + 22} V ${y + 70} H ${plotR + 36}`}
                className="mrd-chip-elbow"
              />
              <rect
                x={plotR + 36}
                y={y}
                width={268}
                height={148}
                rx={14}
                className="mrd-chip"
              />
              <text x={plotR + 54} y={y + 40} className="mrd-chip-label">
                {chip.label}
              </text>
              <text x={plotR + 54} y={y + 88} className="mrd-chip-value">
                {chip.value}
              </text>
              {chipCites && chipCites.length > 0 ? (
                <SvgRefCite items={chipCites} x={plotR + 170} y={y + 122} fontSize={14} />
              ) : null}
            </g>
          );
        })}

        <rect x={28} y={412} width={904} height={50} rx={12} className="mrd-gate" />
        <text x={52} y={432} className="mrd-gate-mark">
          ✓
        </text>
        <text x={78} y={432} className="mrd-gate-label">
          {gateLabel}
        </text>
        <text x={78} y={450} className="mrd-gate-note">
          Every reported code milestone remains subject to engineer approval.
        </text>
      </svg>
    </div>
  );
}

const css = `
.mrd-eyebrow {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.mrd-claim {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-threshold-chip {
  fill: color-mix(in srgb, var(--brand-primary) 8%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 42%, var(--border-color));
  stroke-width: 1.25;
}
.mrd-threshold-kicker {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-threshold-value {
  fill: var(--brand-primary);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-axis-title,
.mrd-time-label,
.mrd-series-label {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-series-label { font-weight: 600; }
.mrd-series-label--compare { fill: var(--color-info); }
.mrd-tick {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-grid {
  stroke: var(--border-color);
  stroke-width: 1;
}
.mrd-grid--major {
  stroke: color-mix(in srgb, var(--brand-primary) 28%, var(--border-color));
}
.mrd-threshold-line {
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-dasharray: 7 6;
}
.mrd-area {
  fill: color-mix(in srgb, var(--brand-primary) 14%, transparent);
}
.mrd-line {
  stroke: var(--brand-primary);
  stroke-width: 3.2;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 12 10;
  animation: mrd-flow 3s linear infinite;
}
.mrd-projection {
  stroke: var(--brand-primary);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 2.2 5.6;
  animation: mrd-flow 0.8s linear infinite;
}
.mrd-projection-point {
  fill: var(--bg-color);
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-dasharray: 2 2;
}
.mrd-projection-label {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-year-tick {
  stroke: var(--secondary-text-color);
  stroke-width: 1;
}
.mrd-year-label {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mrd-point-ring {
  fill: color-mix(in srgb, var(--brand-primary) 16%, var(--bg-color));
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  animation: mrd-pulse 2.4s ease-in-out infinite;
}
.mrd-point-ring--compare {
  fill: color-mix(in srgb, var(--color-info) 16%, var(--bg-color));
  stroke: var(--color-info);
}
.mrd-point { fill: var(--brand-primary); }
.mrd-point--compare { fill: var(--color-info); }
.mrd-point-value {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-point-value--compare { fill: var(--color-info); }
.mrd-point-period {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-point-period--compare { fill: var(--color-info); }
.mrd-chip {
  fill: var(--card-bg-color);
  stroke: var(--brand-primary);
  stroke-width: 1.5;
  stroke-dasharray: 7 5;
}
.mrd-chip-label {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-chip-value {
  fill: var(--brand-primary);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-chip-elbow {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-linecap: square;
  stroke-dasharray: 8 90;
  animation: mrd-flow 2.6s linear infinite;
}
.mrd-gate {
  fill: color-mix(in srgb, var(--brand-primary) 8%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 30%, var(--border-color));
  stroke-width: 1;
}
.mrd-gate-mark,
.mrd-gate-label {
  fill: var(--brand-primary);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd-gate-note {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mrd .svg-ref-cite-text {
  fill: var(--brand-primary);
  font-family: var(--font-mono, ui-monospace, monospace);
}
@keyframes mrd-flow { to { stroke-dashoffset: -100; } }
@keyframes mrd-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .mrd-line,
  .mrd-projection,
  .mrd-chip-elbow,
  .mrd-point-ring {
    animation: none !important;
  }
  .mrd-line { stroke-dasharray: none; }
  .mrd-projection { stroke-dasharray: 2.2 5.6; }
  .mrd-chip-elbow { stroke-dasharray: none; }
}
`;

export default MediationRiseDiagram;
