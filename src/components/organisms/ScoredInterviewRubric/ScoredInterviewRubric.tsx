/**
 * Scored interview rubric: dimensions as scored columns under one junior/senior
 * bar, plus a post-hire pulse method rail (method published · results open).
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type ScoredRubricDimension = {
  id: string;
  n: string;
  label: string;
  detail: string;
  scoreLabel?: string;
};

export type ScoredInterviewRubricProps = {
  dimensions: readonly ScoredRubricDimension[];
  barLabel?: string;
  pulse45Label?: string;
  pulse90Label?: string;
  pulseCaveat?: string;
  claim?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 320;

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
  return lines.slice(0, 4);
}

export function ScoredInterviewRubric({
  dimensions,
  barLabel = "Same fluency bar · junior and senior",
  pulse45Label = "45-day pulse",
  pulse90Label = "90-day pulse",
  pulseCaveat = "Method published · results not yet in primaries",
  claim = "Score craft in the loop. Validate after hire.",
  cites,
  title = "",
  description = "",
  className,
}: ScoredInterviewRubricProps) {
  if (dimensions.length < 2) return null;

  const padX = 40;
  const topY = 28;
  const colGap = 16;
  const usable = VB_W - padX * 2;
  const colW = (usable - colGap * (dimensions.length - 1)) / dimensions.length;
  const colH = 132;
  const cols = dimensions.map((d, i) => ({
    ...d,
    x: padX + i * (colW + colGap),
    y: topY + 36,
  }));

  const barY = topY + 8;
  const pulseY = topY + 36 + colH + 28;

  return (
    <div
      className={["sir w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="scored-interview-rubric"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "sir-title sir-desc" : undefined}
        aria-label={!title && !description ? "Scored interview rubric" : undefined}
      >
        <title id="sir-title">{title}</title>
        <desc id="sir-desc">{description}</desc>

        {/* Shared bar */}
        <rect x={padX} y={barY} width={usable} height={22} rx={11} className="sir-bar" />
        <text
          x={VB_W / 2}
          y={barY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-bar-text"
        >
          {barLabel}
        </text>

        {/* Dimension columns */}
        {cols.map((c) => (
          <g key={c.id} data-sir-dim={c.id}>
            <rect x={c.x} y={c.y} width={colW} height={colH} rx={14} className="sir-card" />
            <circle cx={c.x + 28} cy={c.y + 28} r={16} className="sir-score-ring" />
            <circle cx={c.x + 28} cy={c.y + 28} r={7} className="sir-score-core" />
            <text x={c.x + 28} y={c.y + 28} textAnchor="middle" dominantBaseline="middle" className="sir-n">
              {c.n}
            </text>
            <text x={c.x + 54} y={c.y + 24} className="sir-label">
              {c.label}
            </text>
            <text x={c.x + 54} y={c.y + 42} className="sir-score-label">
              {c.scoreLabel ?? "Scored in loop"}
            </text>
            <text x={c.x + 16} y={c.y + 72} className="sir-detail">
              {wrapDetail(c.detail, Math.floor(colW / 7.2)).map((line, li) => (
                <tspan key={`${c.id}-d-${li}`} x={c.x + 16} dy={li === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        {/* Pulse method rail */}
        <rect
          x={padX}
          y={pulseY}
          width={usable}
          height={56}
          rx={12}
          className="sir-pulse-rail"
        />
        <text x={padX + 18} y={pulseY + 20} className="sir-pulse-title">
          Post-hire validation method
        </text>
        <rect x={padX + 18} y={pulseY + 30} width={110} height={18} rx={9} className="sir-pulse-chip" />
        <text x={padX + 73} y={pulseY + 40} textAnchor="middle" dominantBaseline="middle" className="sir-pulse-chip-text">
          {pulse45Label}
        </text>
        <path
          d={`M ${padX + 136} ${pulseY + 39} H ${padX + 168}`}
          className="sir-pulse-arrow"
        />
        <rect x={padX + 176} y={pulseY + 30} width={110} height={18} rx={9} className="sir-pulse-chip" />
        <text x={padX + 231} y={pulseY + 40} textAnchor="middle" dominantBaseline="middle" className="sir-pulse-chip-text">
          {pulse90Label}
        </text>
        <text x={VB_W - padX - 16} y={pulseY + 40} textAnchor="end" dominantBaseline="middle" className="sir-pulse-caveat">
          {pulseCaveat}
        </text>

        <text x={VB_W / 2} y={VB_H - 12} textAnchor="middle" className="sir-claim">
          {claim}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={VB_W / 2} y={VB_H - 2} fontSize={10} />
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.sir-bar {
  fill: color-mix(in srgb, var(--brand-primary) 14%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 45%, var(--border-color));
  stroke-width: 1;
}
.sir-bar-text {
  fill: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-card {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.5;
}
.sir-score-ring {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 2;
}
.sir-score-core {
  fill: var(--brand-primary);
  animation: sir-pulse 2.2s ease-in-out infinite;
}
.sir-n {
  fill: var(--bg-color);
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-label {
  fill: var(--strong-text-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-score-label {
  fill: var(--secondary-text-color);
  font-size: 10.5px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-detail {
  fill: var(--secondary-text-color);
  font-size: 12px;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-pulse-rail {
  fill: color-mix(in srgb, var(--card-bg-color) 85%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1;
}
.sir-pulse-title {
  fill: var(--strong-text-color);
  font-size: 11.5px;
  font-weight: 600;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-pulse-chip {
  fill: var(--bg-color);
  stroke: var(--brand-primary);
  stroke-width: 1.25;
}
.sir-pulse-chip-text {
  fill: var(--brand-primary);
  font-size: 10px;
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-pulse-arrow {
  stroke: var(--brand-primary);
  stroke-width: 2;
  stroke-linecap: round;
  marker-end: none;
}
.sir-pulse-caveat {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-claim {
  fill: var(--secondary-text-color);
  font-size: 12px;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes sir-pulse {
  0%, 100% { opacity: 0.65; }
  50% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sir-score-core { animation: none !important; }
}
`;

export default ScoredInterviewRubric;
