/**
 * Hiring selection map. Employers cluster by the characteristic they
 * try to observe, with the published method on each card. One fluid
 * animated SVG for every viewport.
 */

import { wrapLines } from "@/components/organisms/MultiModePolicyBand/wrapLines.js";

export type HiringSkillOperator = {
  id: string;
  label: string;
  skill: string;
  method: string;
  tone?: "brand" | "bind" | "neutral";
};

export type HiringSkillCluster = {
  id: string;
  n?: string;
  label: string;
  detail: string;
  operators: readonly HiringSkillOperator[];
};

export type HiringSkillMapProps = {
  clusters: readonly HiringSkillCluster[];
  looksForLabel?: string;
  methodLabel?: string;
  claim?: string;
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 800;
const PAD_X = 20;
const PAD_Y = 16;
const COL_GAP = 12;
const HEADER_H = 74;
const CARD_GAP = 7;
const CLAIM_Y = VB_H - 20;
const SKILL_MAX = 22;
const METHOD_MAX = 24;
const METHOD_LINES = 6;

export function HiringSkillMap({
  clusters,
  looksForLabel = "Looks for",
  methodLabel = "Surfaces it by",
  claim = "Each policy observes a skill. The skill is the hiring object.",
  title = "",
  description = "",
  className,
}: HiringSkillMapProps) {
  if (clusters.length < 2) return null;

  const cols = clusters.slice(0, 4);
  const usable = VB_W - PAD_X * 2;
  const colW = (usable - COL_GAP * (cols.length - 1)) / cols.length;
  const cardTop = PAD_Y + HEADER_H + 8;
  const cardAreaH = CLAIM_Y - 22 - cardTop;

  return (
    <div
      className={["hsm w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="hiring-skill-map"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "hsm-title hsm-desc" : undefined}
        aria-label={!title && !description ? "Hiring selection signals" : undefined}
      >
        <title id="hsm-title">{title}</title>
        <desc id="hsm-desc">{description}</desc>

        {cols.map((cluster, i) => {
          const x = PAD_X + i * (colW + COL_GAP);
          const ops = cluster.operators;
          const maxCard = ops.length >= 4 ? cardAreaH : Math.min(228, cardAreaH);
          const cardH = Math.min(
            maxCard,
            (cardAreaH - CARD_GAP * Math.max(0, ops.length - 1)) / Math.max(1, ops.length),
          );
          return (
            <g key={cluster.id} data-hsm-cluster={cluster.id}>
              {i < cols.length - 1 ? (
                <path
                  d={`M ${x + colW + 2} ${PAD_Y + 28} H ${x + colW + COL_GAP - 2}`}
                  className="hsm-connector"
                />
              ) : null}
              <rect
                x={x}
                y={PAD_Y}
                width={colW}
                height={HEADER_H}
                rx={12}
                className="hsm-head"
              />
              <text x={x + 12} y={PAD_Y + 18} className="hsm-n">
                {cluster.n ?? String(i + 1).padStart(2, "0")}
              </text>
              <text x={x + 12} y={PAD_Y + 36} className="hsm-cluster-label">
                {cluster.label}
              </text>
              <text x={x + 12} y={PAD_Y + 52} className="hsm-cluster-detail">
                {wrapLines(cluster.detail, 28, 2).map((line, li) => (
                  <tspan
                    key={`${cluster.id}-d-${li}`}
                    x={x + 12}
                    dy={li === 0 ? 0 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>

              {ops.map((op, oi) => {
                const y = cardTop + oi * (cardH + CARD_GAP);
                const skillLines = wrapLines(op.skill, SKILL_MAX, 2);
                const methodLines = wrapLines(op.method, METHOD_MAX, METHOD_LINES);
                const skillY = y + 44;
                const methodKickerY = skillY + skillLines.length * 14 + 6;
                const methodY = methodKickerY + 14;
                const tone =
                  op.tone === "brand"
                    ? "hsm-card hsm-card--brand"
                    : op.tone === "bind"
                      ? "hsm-card hsm-card--bind"
                      : "hsm-card";
                return (
                  <g key={op.id} data-hsm-op={op.id}>
                    <rect
                      x={x}
                      y={y}
                      width={colW}
                      height={cardH}
                      rx={11}
                      className={tone}
                    />
                    <text x={x + 10} y={y + 18} className="hsm-op">
                      {op.label}
                    </text>
                    <text x={x + 10} y={y + 32} className="hsm-kicker hsm-kicker--skill">
                      {looksForLabel}
                    </text>
                    <text x={x + 10} y={skillY} className="hsm-skill">
                      {skillLines.map((line, li) => (
                        <tspan
                          key={`${op.id}-s-${li}`}
                          x={x + 10}
                          dy={li === 0 ? 0 : 14}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                    <text x={x + 10} y={methodKickerY} className="hsm-kicker">
                      {methodLabel}
                    </text>
                    <text x={x + 10} y={methodY} className="hsm-method">
                      {methodLines.map((line, li) => (
                        <tspan
                          key={`${op.id}-m-${li}`}
                          x={x + 10}
                          dy={li === 0 ? 0 : 13}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {claim ? (
          <text x={VB_W / 2} y={CLAIM_Y} textAnchor="middle" className="hsm-claim">
            {claim}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.hsm-head {
  fill: color-mix(in srgb, var(--brand-primary) 9%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 28%, var(--border-color));
  stroke-width: 1.25;
}
.hsm-n {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hsm-cluster-label {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-cluster-detail {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-card {
  fill: var(--bg-color);
  stroke: var(--border-color);
  stroke-width: 1.5;
}
.hsm-card--brand {
  stroke: var(--brand-primary);
  fill: color-mix(in srgb, var(--brand-primary) 6%, var(--bg-color));
}
.hsm-card--bind {
  stroke: color-mix(in srgb, var(--brand-primary) 55%, #c45c26);
  stroke-dasharray: 6 4;
}
.hsm-op {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-kicker {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hsm-kicker--skill { fill: var(--brand-primary); }
.hsm-skill {
  fill: var(--strong-text-color);
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-method {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-claim {
  fill: var(--secondary-text-color);
  font-size: var(--text-base);
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hsm-connector {
  stroke: var(--brand-primary);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 8 92;
  animation: hsm-flow 2.4s linear infinite;
}
@keyframes hsm-flow { to { stroke-dashoffset: -100; } }
@media (prefers-reduced-motion: reduce) {
  .hsm-connector { animation: none !important; stroke-dasharray: none; }
}
`;

export default HiringSkillMap;
