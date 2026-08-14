/**
 * Scored interview architecture: shared junior/senior bar, scored dimensions,
 * then a post-hire method rail that ends in an unpublished-results slot.
 * Optional inter-round redundancy callout. One fluid animated SVG.
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

export type ScoredRubricPhase = {
  id: string;
  n?: string;
  label: string;
  detail: string;
};

export type ScoredInterviewRubricProps = {
  dimensions: readonly ScoredRubricDimension[];
  /** Optional rebuild phases drawn above the scored bar. */
  phases?: readonly ScoredRubricPhase[];
  barLabel?: string;
  pulse45Label?: string;
  pulse90Label?: string;
  pulseCaveat?: string;
  resultsOpenLabel?: string;
  interRoundLabel?: string;
  interRoundValue?: string;
  goalLabel?: string;
  claim?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 430;

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
  phases,
  barLabel = "Same fluency bar · junior and senior",
  pulse45Label = "45-day pulse",
  pulse90Label = "90-day pulse",
  pulseCaveat = "Method published · results not yet in primaries",
  resultsOpenLabel = "Results unpublished",
  interRoundLabel = "Inter-round correlation",
  interRoundValue,
  goalLabel,
  claim = "Score craft in the loop. Validate after hire.",
  cites,
  title = "",
  description = "",
  className,
}: ScoredInterviewRubricProps) {
  if (dimensions.length < 2) return null;

  const padX = 36;
  const phaseRow = phases && phases.length > 0 ? phases : [];
  const phaseH = phaseRow.length > 0 ? 56 : 0;
  const topY = 14 + phaseH;
  const colGap = 14;
  const usable = VB_W - padX * 2;
  const colW = (usable - colGap * (dimensions.length - 1)) / dimensions.length;
  const colH = 124;
  const cols = dimensions.map((d, i) => ({
    ...d,
    x: padX + i * (colW + colGap),
    y: topY + 34,
  }));
  const barY = topY + 6;
  const pulseY = topY + 34 + colH + 22;
  const phaseW =
    phaseRow.length > 0
      ? (usable - 20 * (phaseRow.length - 1)) / phaseRow.length
      : 0;

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

        {phaseRow.map((p, i) => {
          const x = padX + i * (phaseW + 20);
          return (
            <g key={p.id} data-sir-phase={p.id}>
              <rect x={x} y={10} width={phaseW} height={44} rx={10} className="sir-phase" />
              <text x={x + 14} y={26} className="sir-phase-n">
                {p.n ?? String(i + 1).padStart(2, "0")}
              </text>
              <text x={x + 40} y={26} className="sir-phase-label">
                {p.label}
              </text>
              <text x={x + 14} y={42} className="sir-phase-detail">
                {p.detail}
              </text>
              {i < phaseRow.length - 1 ? (
                <path
                  d={`M ${x + phaseW + 3} ${32} H ${x + phaseW + 17}`}
                  className="sir-phase-arrow"
                />
              ) : null}
            </g>
          );
        })}

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

        {cols.map((c) => (
          <g key={c.id} data-sir-dim={c.id}>
            <rect x={c.x} y={c.y} width={colW} height={colH} rx={14} className="sir-card" />
            <circle cx={c.x + 26} cy={c.y + 26} r={15} className="sir-score-ring" />
            <circle cx={c.x + 26} cy={c.y + 26} r={6.5} className="sir-score-core" />
            <text
              x={c.x + 26}
              y={c.y + 26}
              textAnchor="middle"
              dominantBaseline="middle"
              className="sir-n"
            >
              {c.n}
            </text>
            <text x={c.x + 50} y={c.y + 22} className="sir-label">
              {c.label}
            </text>
            <text x={c.x + 50} y={c.y + 40} className="sir-score-label">
              {c.scoreLabel ?? "Scored in loop"}
            </text>
            <text x={c.x + 14} y={c.y + 68} className="sir-detail">
              {wrapDetail(c.detail, Math.floor(colW / 7.2)).map((line, li) => (
                <tspan key={`${c.id}-d-${li}`} x={c.x + 14} dy={li === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        <path
          d={`M ${VB_W / 2} ${topY + 34 + colH} V ${pulseY}`}
          className="sir-down"
        />

        <rect
          x={padX}
          y={pulseY}
          width={usable}
          height={72}
          rx={12}
          className="sir-pulse-rail"
        />
        <text x={padX + 16} y={pulseY + 18} className="sir-pulse-title">
          Post-hire validation method
        </text>

        <rect x={padX + 16} y={pulseY + 30} width={118} height={28} rx={8} className="sir-pulse-chip" />
        <text
          x={padX + 75}
          y={pulseY + 45}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-chip-text"
        >
          {pulse45Label}
        </text>
        <path
          d={`M ${padX + 140} ${pulseY + 44} H ${padX + 168}`}
          className="sir-pulse-arrow"
        />
        <rect x={padX + 174} y={pulseY + 30} width={118} height={28} rx={8} className="sir-pulse-chip" />
        <text
          x={padX + 233}
          y={pulseY + 45}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-chip-text"
        >
          {pulse90Label}
        </text>
        <path
          d={`M ${padX + 298} ${pulseY + 44} H ${padX + 326}`}
          className="sir-pulse-arrow"
        />
        <rect
          x={padX + 332}
          y={pulseY + 30}
          width={150}
          height={28}
          rx={8}
          className="sir-pulse-open"
        />
        <text
          x={padX + 407}
          y={pulseY + 45}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-open-text"
        >
          {resultsOpenLabel}
        </text>

        {goalLabel ? (
          <text x={VB_W - padX - 16} y={pulseY + 20} textAnchor="end" className="sir-goal">
            {goalLabel}
          </text>
        ) : (
          <text x={VB_W - padX - 16} y={pulseY + 20} textAnchor="end" className="sir-pulse-caveat">
            {pulseCaveat}
          </text>
        )}
        {goalLabel ? (
          <text x={VB_W - padX - 16} y={pulseY + 58} textAnchor="end" className="sir-pulse-caveat">
            {pulseCaveat}
          </text>
        ) : null}

        {interRoundValue ? (
          <text x={padX + 16} y={VB_H - 14} className="sir-inter">
            {interRoundLabel} · {interRoundValue}
          </text>
        ) : null}

        <text
          x={interRoundValue ? VB_W - padX : VB_W / 2}
          y={VB_H - 14}
          textAnchor={interRoundValue ? "end" : "middle"}
          className="sir-claim"
        >
          {claim}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={VB_W - padX} y={VB_H - 6} fontSize={10} />
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
.sir-phase {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.25;
}
.sir-phase-n {
  fill: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-phase-label {
  fill: var(--strong-text-color);
  font-size: 12.5px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-phase-detail {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-phase-arrow {
  stroke: var(--brand-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 6 94;
  animation: sir-flow 2.4s linear infinite;
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
  font-size: 13.5px;
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
.sir-down {
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-dasharray: 4 4;
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
  font-size: 10.5px;
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-pulse-arrow {
  stroke: var(--brand-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 6 94;
  animation: sir-flow 2.4s linear infinite;
}
.sir-pulse-open {
  fill: transparent;
  stroke: var(--border-color);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}
.sir-pulse-open-text {
  fill: var(--secondary-text-color);
  font-size: 10.5px;
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-pulse-caveat {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-goal {
  fill: var(--brand-primary);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-inter {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-mono, ui-monospace, monospace);
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
@keyframes sir-flow { to { stroke-dashoffset: -100; } }
@media (prefers-reduced-motion: reduce) {
  .sir-score-core, .sir-pulse-arrow { animation: none !important; }
  .sir-pulse-arrow { stroke-dasharray: none; }
}
`;

export default ScoredInterviewRubric;
