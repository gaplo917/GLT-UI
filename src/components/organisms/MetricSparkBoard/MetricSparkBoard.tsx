/**
 * Fluid SVG metric board: value tiles with optional sparkline trends and
 * per-tile SVG citation markers.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type MetricSparkMetric = {
  id: string;
  label: string;
  value: string;
  hint: string;
  citeKey?: string;
  trend: readonly number[];
  trendIntent: "brand" | "success";
};

export type MetricSparkBoardProps = {
  /** One tile per metric (column count follows length). */
  metrics: readonly MetricSparkMetric[];
  /**
   * Per-tile sources keyed by `metric.citeKey`. Presentation slides omit cites.
   * Rendered as SVG `<a>` + `<text>` inside each tile (not foreignObject HTML).
   */
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  /** Accessible title (SVG `<title>`). Empty by default. */
  title?: string;
  /** Accessible description (SVG `<desc>`). Empty by default. */
  description?: string;
  /** Fallback accessible label when title and description are omitted. */
  ariaLabel?: string;
  /** Locale-specific visible label and hint overrides, keyed by metric id. */
  metricLabels?: Readonly<Record<string, { label?: string; hint?: string }>>;
  className?: string;
};

const VB_W = 960;
const VB_H = 268;
const GAP = 14;
const PAD = 12;

function sparklinePath(
  series: readonly number[],
  x: number,
  y: number,
  w: number,
  h: number,
): string {
  if (series.length === 0) return "";
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => {
      const px = x + (series.length === 1 ? w / 2 : (i / (series.length - 1)) * w);
      const py = y + h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

function labelLines(label: string): string[] {
  if (label.includes(" / ")) {
    const [a, b] = label.split(" / ");
    return [a.trim(), `/ ${b.trim()}`];
  }
  if (label.length <= 16) return [label];
  const mid = Math.floor(label.length / 2);
  const at = label.lastIndexOf(" ", mid);
  if (at < 6) return [label];
  return [label.slice(0, at), label.slice(at + 1)];
}

function hintLines(hint: string): string[] {
  if (hint.length <= 28) return [hint];
  const dot = hint.indexOf(" · ");
  if (dot > 8 && dot < hint.length - 6) {
    return [hint.slice(0, dot).trim(), hint.slice(dot + 3).trim()];
  }
  const mid = Math.floor(hint.length / 2);
  const left = hint.lastIndexOf(" ", mid);
  const right = hint.indexOf(" ", mid);
  const at = left > 8 ? left : right > 0 ? right : -1;
  if (at < 0) return [hint];
  return [hint.slice(0, at).trim(), hint.slice(at + 1).trim()];
}

/**
 * Direction-of-travel tiles in one fluid SVG.
 * When `cites` is set, each tile’s source line ends with SVG `<a>` [n] markers.
 */
export function MetricSparkBoard({
  metrics,
  cites,
  title = "",
  description = "",
  ariaLabel = "Metric board",
  metricLabels,
  className,
}: MetricSparkBoardProps) {
  const showCites = Boolean(cites);
  const cols = Math.max(1, metrics.length);
  const cellW = (VB_W - PAD * 2 - GAP * (cols - 1)) / cols;
  const cellH = VB_H - PAD * 2;

  return (
    <div
      className={["msb w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="metric-spark-board"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "msb-title msb-desc" : undefined}
        aria-label={!title && !description ? ariaLabel : undefined}
      >
        <title id="msb-title">{title}</title>
        <desc id="msb-desc">{description}</desc>

        {metrics.map((m, i) => {
          const localized = metricLabels?.[m.id];
          const metricLabel = localized?.label ?? m.label;
          const metricHint = localized?.hint ?? m.hint;
          const x = PAD + i * (cellW + GAP);
          const y = PAD;
          const sparkW = cellW - 44;
          const sparkH = 28;
          const strokeClass =
            m.trendIntent === "success" ? "msb-spark-success" : "msb-spark-brand";
          const lines = hintLines(metricHint);
          const hintBaseY = showCites ? cellH - 40 : cellH - 36;
          const tileCites = m.citeKey ? cites?.[m.citeKey] : undefined;

          return (
            <g key={m.id} transform={`translate(${x} ${y})`}>
              <rect width={cellW} height={cellH} rx={14} ry={14} className="msb-card" />
              <text x={cellW / 2} y={28} textAnchor="middle" className="msb-label">
                {labelLines(metricLabel).map((line, li) => (
                  <tspan key={line} x={cellW / 2} dy={li === 0 ? 0 : 15}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text
                x={cellW / 2}
                y={108}
                textAnchor="middle"
                dominantBaseline="middle"
                className="msb-value"
              >
                {m.value}
              </text>
              <path
                d={sparklinePath(m.trend, 22, cellH - 92, sparkW, sparkH)}
                className={strokeClass}
                fill="none"
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={cellW / 2}
                y={hintBaseY}
                textAnchor="middle"
                className="msb-hint"
              >
                {lines.map((line, li) => (
                  <tspan key={`${line}-${li}`} x={cellW / 2} dy={li === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
              {tileCites && tileCites.length > 0 ? (
                <g data-msb-cite-tile={m.id} data-msb-cite-key={m.citeKey}>
                  <SvgRefCite
                    items={tileCites}
                    x={cellW / 2}
                    y={cellH - 12}
                    fontSize={11}
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const css = `
.msb-card {
  fill: color-mix(in srgb, var(--card-bg-color) 88%, transparent);
  stroke: var(--border-color);
  stroke-width: 1.25;
}
.msb-label {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.msb-value {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.msb-hint {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 500;
}
.msb-spark-brand {
  stroke: var(--brand-primary);
}
.msb-spark-success {
  stroke: var(--success-color, var(--brand-primary));
}
.msb a.svg-ref-cite {
  cursor: pointer;
}
.msb .svg-ref-cite-text {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-weight: 600;
}
.msb a.svg-ref-cite:hover .svg-ref-cite-text,
.msb a.svg-ref-cite:focus-visible .svg-ref-cite-text {
  text-decoration: underline;
  text-underline-offset: 2px;
}
`;

export default MetricSparkBoard;
