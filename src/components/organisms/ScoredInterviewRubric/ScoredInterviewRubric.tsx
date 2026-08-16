/**
 * Scored interview architecture: shared junior/senior bar, scored dimensions,
 * then a post-hire method rail that ends in an unpublished-results slot.
 * Optional inter-round redundancy callout. One fluid animated SVG.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";
import { wrapLines } from "@/components/organisms/MultiModePolicyBand/wrapLines.js";

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
const VB_H = 720;
const PAD_X = 24;
const PAD_Y = 16;
const COL_GAP = 14;
const INSET = 16;

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

  const phaseRow = phases && phases.length > 0 ? phases : [];
  const usable = VB_W - PAD_X * 2;
  const colW = (usable - COL_GAP * (dimensions.length - 1)) / dimensions.length;
  const colX = (i: number) => PAD_X + i * (colW + COL_GAP);

  const phaseH = phaseRow.length > 0 ? 100 : 0;
  const phaseY = PAD_Y;
  const barY = phaseRow.length > 0 ? phaseY + phaseH + 12 : PAD_Y;
  const barH = 30;
  const dimY = barY + barH + 12;
  const dimH = 176;
  const pulseY = dimY + dimH + 16;
  const pulseH = 118;
  const claimY = pulseY + pulseH + 26;

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
          const x = colX(i);
          const n = p.n ?? String(i + 1).padStart(2, "0");
          return (
            <g key={p.id} data-sir-phase={p.id}>
              <rect
                x={x}
                y={phaseY}
                width={colW}
                height={phaseH}
                rx={12}
                className="sir-phase"
              />
              <text x={x + INSET} y={phaseY + 28} className="sir-n">
                {n}
              </text>
              <text x={x + INSET + 28} y={phaseY + 28} className="sir-label">
                {p.label}
              </text>
              <text x={x + INSET} y={phaseY + 52} className="sir-detail">
                {wrapLines(p.detail, 28, 3).map((line, li) => (
                  <tspan
                    key={`${p.id}-pd-${li}`}
                    x={x + INSET}
                    dy={li === 0 ? 0 : 16}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              {i < phaseRow.length - 1 ? (
                <path
                  d={`M ${x + colW + 3} ${phaseY + 28} H ${x + colW + COL_GAP - 3}`}
                  className="sir-flow-line"
                />
              ) : null}
            </g>
          );
        })}

        <rect
          x={PAD_X}
          y={barY}
          width={usable}
          height={barH}
          rx={15}
          className="sir-bar"
        />
        <text
          x={VB_W / 2}
          y={barY + barH / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-bar-text"
        >
          {barLabel}
        </text>

        {dimensions.map((d, i) => {
          const x = colX(i);
          return (
            <g key={d.id} data-sir-dim={d.id}>
              <rect
                x={x}
                y={dimY}
                width={colW}
                height={dimH}
                rx={12}
                className="sir-card"
              />
              <text x={x + INSET} y={dimY + 30} className="sir-n">
                {d.n}
              </text>
              <text x={x + INSET + 28} y={dimY + 30} className="sir-label">
                {wrapLines(d.label, 22, 2).map((line, li) => (
                  <tspan
                    key={`${d.id}-l-${li}`}
                    x={x + INSET + 28}
                    dy={li === 0 ? 0 : 20}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              <text x={x + INSET} y={dimY + 68} className="sir-score-label">
                {d.scoreLabel ?? "Scored in loop"}
              </text>
              <text x={x + INSET} y={dimY + 96} className="sir-detail">
                {wrapLines(d.detail, Math.max(22, Math.floor((colW - INSET * 2) / 8)), 4).map(
                  (line, li) => (
                    <tspan
                      key={`${d.id}-d-${li}`}
                      x={x + INSET}
                      dy={li === 0 ? 0 : 18}
                    >
                      {line}
                    </tspan>
                  ),
                )}
              </text>
            </g>
          );
        })}

        <path
          d={`M ${VB_W / 2} ${dimY + dimH} V ${pulseY}`}
          className="sir-flow-line"
        />

        <rect
          x={PAD_X}
          y={pulseY}
          width={usable}
          height={pulseH}
          rx={12}
          className="sir-pulse-rail"
        />
        <text x={PAD_X + INSET} y={pulseY + 28} className="sir-pulse-title">
          Post-hire validation method
        </text>
        {goalLabel ? (
          <text
            x={VB_W - PAD_X - INSET}
            y={pulseY + 28}
            textAnchor="end"
            className="sir-goal"
          >
            {goalLabel}
          </text>
        ) : null}

        <rect
          x={PAD_X + INSET}
          y={pulseY + 46}
          width={128}
          height={32}
          rx={8}
          className="sir-pulse-chip"
        />
        <text
          x={PAD_X + INSET + 64}
          y={pulseY + 62}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-chip-text"
        >
          {pulse45Label}
        </text>
        <path
          d={`M ${PAD_X + INSET + 132} ${pulseY + 62} H ${PAD_X + INSET + 154}`}
          className="sir-flow-line"
        />
        <rect
          x={PAD_X + INSET + 158}
          y={pulseY + 46}
          width={128}
          height={32}
          rx={8}
          className="sir-pulse-chip"
        />
        <text
          x={PAD_X + INSET + 222}
          y={pulseY + 62}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-chip-text"
        >
          {pulse90Label}
        </text>
        <path
          d={`M ${PAD_X + INSET + 290} ${pulseY + 62} H ${PAD_X + INSET + 312}`}
          className="sir-flow-line"
        />
        <rect
          x={PAD_X + INSET + 316}
          y={pulseY + 46}
          width={168}
          height={32}
          rx={8}
          className="sir-pulse-open"
        />
        <text
          x={PAD_X + INSET + 400}
          y={pulseY + 62}
          textAnchor="middle"
          dominantBaseline="middle"
          className="sir-pulse-open-text"
        >
          {resultsOpenLabel}
        </text>
        <text
          x={VB_W - PAD_X - INSET}
          y={pulseY + 62}
          textAnchor="end"
          dominantBaseline="middle"
          className="sir-pulse-caveat"
        >
          {pulseCaveat}
        </text>

        {interRoundValue ? (
          <text x={PAD_X} y={claimY} className="sir-inter">
            {interRoundLabel} · {interRoundValue}
          </text>
        ) : null}
        <text
          x={interRoundValue ? VB_W - PAD_X : VB_W / 2}
          y={claimY}
          textAnchor={interRoundValue ? "end" : "middle"}
          className="sir-claim"
        >
          {claim}
        </text>
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={VB_W - PAD_X} y={claimY + 2} fontSize={14} />
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
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-phase,
.sir-card {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.25;
}
.sir-n {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-label {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-score-label {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-detail {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-flow-line {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 2.2 5.6;
  animation: sir-flow 0.8s linear infinite;
}
.sir-pulse-rail {
  fill: color-mix(in srgb, var(--card-bg-color) 85%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1;
}
.sir-pulse-title {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
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
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-pulse-open {
  fill: transparent;
  stroke: var(--border-color);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}
.sir-pulse-open-text {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-pulse-caveat {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.sir-goal {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-inter {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.sir-claim {
  fill: var(--secondary-text-color);
  font-size: var(--text-base);
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes sir-flow { to { stroke-dashoffset: -15.6; } }
@media (prefers-reduced-motion: reduce) {
  .sir-flow-line { animation: none !important; }
}
`;

export default ScoredInterviewRubric;
