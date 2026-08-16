/**
 * Interview-stage before/after comparison. Five stages sit on one
 * contain-fitted SVG so the same composition scales on every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";
import { wrapLines } from "@/components/organisms/MultiModePolicyBand/wrapLines.js";

export type InterviewStageShiftRow = {
  id: string;
  stage: string;
  before: string;
  after: string;
};

export type InterviewStageShiftProps = {
  rows: readonly InterviewStageShiftRow[];
  stageLabel?: string;
  beforeLabel?: string;
  afterLabel?: string;
  claim?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 720;
const PAD_X = 20;
const PAD_Y = 16;
const HEADER_H = 36;
const CLAIM_Y = VB_H - 18;
const STAGE_W = 252;
const BEFORE_W = 232;
const ARROW_W = 52;
const AFTER_W = 364;
const STAGE_X = PAD_X;
const BEFORE_X = STAGE_X + STAGE_W + 12;
const ARROW_X = BEFORE_X + BEFORE_W + 6;
const AFTER_X = ARROW_X + ARROW_W;
const STAGE_MAX = 16;
const BEFORE_MAX = 22;
const AFTER_MAX = 30;

export function InterviewStageShift({
  rows,
  stageLabel = "Interview Stage",
  beforeLabel = "Before",
  afterLabel = "After",
  claim,
  cites,
  title = "",
  description = "",
  className,
}: InterviewStageShiftProps) {
  if (rows.length < 2) return null;

  const bodyTop = PAD_Y + HEADER_H + 6;
  const bodyH = CLAIM_Y - 24 - bodyTop;
  const gap = 6;
  const rowH = (bodyH - gap * (rows.length - 1)) / rows.length;

  return (
    <div
      className={["iss w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="interview-stage-shift"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "iss-title iss-desc" : undefined}
        aria-label={
          !title && !description ? "Interview stage before and after" : undefined
        }
      >
        <title id="iss-title">{title}</title>
        <desc id="iss-desc">{description}</desc>

        <text x={STAGE_X + 12} y={PAD_Y + 22} className="iss-col-label">
          {stageLabel}
        </text>
        <text x={BEFORE_X + 12} y={PAD_Y + 22} className="iss-col-label">
          {beforeLabel}
        </text>
        <text x={AFTER_X + 12} y={PAD_Y + 22} className="iss-col-label iss-col-label--after">
          {afterLabel}
        </text>

        {rows.map((row, i) => {
          const y = bodyTop + i * (rowH + gap);
          const midY = y + rowH / 2;
          const stageLines = wrapLines(row.stage, STAGE_MAX, 3);
          const beforeLines = wrapLines(row.before, BEFORE_MAX, 4);
          const afterLines = wrapLines(row.after, AFTER_MAX, 5);
          const n = String(i + 1).padStart(2, "0");
          const arrowX1 = ARROW_X + 2;
          const arrowX2 = ARROW_X + ARROW_W - 11;
          const arrowTrack = `M ${arrowX1} ${midY} H ${arrowX2}`;
          return (
            <g key={row.id} data-iss-row={row.id}>
              <rect
                x={STAGE_X}
                y={y}
                width={STAGE_W}
                height={rowH}
                rx={12}
                className="iss-stage-card"
              />
              <circle cx={STAGE_X + 22} cy={y + 20} r={11} className="iss-n-ring" />
              <text
                x={STAGE_X + 22}
                y={y + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="iss-n"
              >
                {n}
              </text>
              <text x={STAGE_X + 14} y={y + 46} className="iss-stage">
                {stageLines.map((line, li) => (
                  <tspan
                    key={`${row.id}-s-${li}`}
                    x={STAGE_X + 14}
                    dy={li === 0 ? 0 : 18}
                  >
                    {line}
                  </tspan>
                ))}
              </text>

              <rect
                x={BEFORE_X}
                y={y}
                width={BEFORE_W}
                height={rowH}
                rx={12}
                className="iss-before-card"
              />
              <text x={BEFORE_X + 14} y={y + 28} className="iss-before">
                {beforeLines.map((line, li) => (
                  <tspan
                    key={`${row.id}-b-${li}`}
                    x={BEFORE_X + 14}
                    dy={li === 0 ? 0 : 16}
                  >
                    {line}
                  </tspan>
                ))}
              </text>

              <g className="iss-arrow-group">
                <path d={arrowTrack} className="iss-arrow-track" />
                <circle r="3.8" className="iss-arrow-dot">
                  <animateMotion
                    dur="1.15s"
                    repeatCount="indefinite"
                    path={arrowTrack}
                  />
                </circle>
                <path
                  d={`M ${arrowX2 - 1} ${midY - 5.5} L ${arrowX2 + 8} ${midY} L ${arrowX2 - 1} ${midY + 5.5} Z`}
                  className="iss-arrow-head"
                />
              </g>

              <rect
                x={AFTER_X}
                y={y}
                width={AFTER_W}
                height={rowH}
                rx={12}
                className="iss-after-card"
              />
              <text x={AFTER_X + 14} y={y + 28} className="iss-after">
                {afterLines.map((line, li) => (
                  <tspan
                    key={`${row.id}-a-${li}`}
                    x={AFTER_X + 14}
                    dy={li === 0 ? 0 : 16}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {claim ? (
          <text x={VB_W / 2} y={CLAIM_Y} textAnchor="middle" className="iss-claim">
            {claim}
          </text>
        ) : null}
        {cites && cites.length > 0 ? (
          <SvgRefCite items={cites} x={VB_W - 36} y={CLAIM_Y} fontSize={14} />
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.iss-col-label {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.iss-col-label--after { fill: var(--brand-primary); }
.iss-n-ring {
  fill: color-mix(in srgb, var(--brand-primary) 12%, var(--bg-color));
  stroke: var(--brand-primary);
  stroke-width: 1.5;
}
.iss-n {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.iss-stage-card {
  fill: color-mix(in srgb, var(--card-bg-color) 86%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1.25;
}
.iss-before-card {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.25;
}
.iss-after-card {
  fill: color-mix(in srgb, var(--brand-primary) 8%, var(--bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 38%, var(--border-color));
  stroke-width: 1.5;
}
.iss-stage {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.iss-before {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.iss-after {
  fill: var(--strong-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.iss-arrow-track {
  fill: none;
  stroke: color-mix(in srgb, var(--brand-primary) 55%, var(--border-color));
  stroke-width: 2.2;
  stroke-linecap: round;
}
.iss-arrow-dot { fill: var(--brand-primary); }
.iss-arrow-head { fill: var(--brand-primary); }
.iss-claim {
  fill: var(--secondary-text-color);
  font-size: var(--text-base);
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.iss .svg-ref-cite-text {
  fill: var(--brand-primary);
  font-family: var(--font-mono, ui-monospace, monospace);
}
@media (prefers-reduced-motion: reduce) {
  .iss-arrow-dot { display: none; }
  .iss-arrow-track { stroke: var(--brand-primary); }
}
`;

export default InterviewStageShift;
