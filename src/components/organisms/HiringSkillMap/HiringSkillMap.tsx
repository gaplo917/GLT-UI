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
const PAD_Y = 14;
const GAP = 12;
const INSET_X = 16;
const INSET_Y = 18;
const HEAD_H = 96;
const LINE = 16;
const CLAIM_Y = VB_H - 18;
const SKILL_MAX = 22;
const METHOD_MAX = 24;
const METHOD_LINES = 8;

function cardTone(tone: HiringSkillOperator["tone"]): string {
  if (tone === "brand") return "hsm-card hsm-card--brand";
  if (tone === "bind") return "hsm-card hsm-card--bind";
  return "hsm-card";
}

function OperatorCard({
  op,
  x,
  y,
  w,
  h,
  looksForLabel,
  methodLabel,
}: {
  op: HiringSkillOperator;
  x: number;
  y: number;
  w: number;
  h: number;
  looksForLabel: string;
  methodLabel: string;
}) {
  const budget = Math.max(18, Math.floor((w - INSET_X * 2) / 7.4));
  const skillLines = wrapLines(op.skill, Math.min(SKILL_MAX, budget), 2);
  const methodLines = wrapLines(op.method, Math.min(METHOD_MAX, budget), METHOD_LINES);
  const textX = x + INSET_X;
  const opY = y + INSET_Y + 12;
  const skillKickerY = opY + 20;
  const skillY = skillKickerY + 16;
  const methodKickerY = skillY + skillLines.length * LINE + 12;
  const methodY = methodKickerY + 16;
  return (
    <g data-hsm-op={op.id}>
      <rect x={x} y={y} width={w} height={h} rx={12} className={cardTone(op.tone)} />
      <text x={textX} y={opY} className="hsm-op">
        {op.label}
      </text>
      <text x={textX} y={skillKickerY} className="hsm-kicker hsm-kicker--skill">
        {looksForLabel}
      </text>
      <text x={textX} y={skillY} className="hsm-skill">
        {skillLines.map((line, li) => (
          <tspan key={`${op.id}-s-${li}`} x={textX} dy={li === 0 ? 0 : LINE}>
            {line}
          </tspan>
        ))}
      </text>
      <text x={textX} y={methodKickerY} className="hsm-kicker">
        {methodLabel}
      </text>
      <text x={textX} y={methodY} className="hsm-method">
        {methodLines.map((line, li) => (
          <tspan key={`${op.id}-m-${li}`} x={textX} dy={li === 0 ? 0 : LINE}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function ClusterHead({
  cluster,
  index,
  x,
  y,
  w,
}: {
  cluster: HiringSkillCluster;
  index: number;
  x: number;
  y: number;
  w: number;
}) {
  const textX = x + INSET_X;
  const stackLabel = w < 280;
  const labelBudget = Math.max(14, Math.floor((w - INSET_X * 2) / 8.5));
  const detailBudget = Math.max(20, Math.floor((w - INSET_X * 2) / 5.8));
  const labelLines = wrapLines(cluster.label, labelBudget, 2);
  const labelY = stackLabel ? y + 38 : y + 20;
  const detailY = stackLabel ? y + 38 + labelLines.length * 16 + 2 : y + 44;
  return (
    <g>
      <rect x={x} y={y} width={w} height={HEAD_H} rx={12} className="hsm-head" />
      <text x={textX} y={y + 20} className="hsm-n">
        {cluster.n ?? String(index + 1).padStart(2, "0")}
      </text>
      <text
        x={stackLabel ? textX : textX + 28}
        y={labelY}
        className="hsm-cluster-label"
      >
        {labelLines.map((line, li) => (
          <tspan key={`${cluster.id}-l-${li}`} x={stackLabel ? textX : textX + 28} dy={li === 0 ? 0 : 16}>
            {line}
          </tspan>
        ))}
      </text>
      <text x={textX} y={detailY} className="hsm-cluster-detail">
        {wrapLines(cluster.detail, detailBudget, 3).map((line, li) => (
          <tspan key={`${cluster.id}-d-${li}`} x={textX} dy={li === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

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

  const [independent, restricted, named, inLoop] = [
    clusters[0]!,
    clusters[1]!,
    clusters[2]!,
    clusters[3] ?? clusters[1]!,
  ];

  const usable = VB_W - PAD_X * 2;
  const topCardY = PAD_Y + HEAD_H + 8;
  const topCardH = 222;
  const topCardW = (usable - GAP * 3) / 4;
  const bottomHeadY = topCardY + topCardH + 16;
  const bottomCardY = bottomHeadY + HEAD_H + 8;
  const bottomCardH = CLAIM_Y - 22 - bottomCardY;
  const bottomFr = [1.05, 2.95, 1.05];
  const bottomSum = bottomFr.reduce((a, b) => a + b, 0);
  const bottomUsable = usable - GAP * 2;
  const bottomWs = bottomFr.map((f) => (bottomUsable * f) / bottomSum);
  const bottomXs = [
    PAD_X,
    PAD_X + bottomWs[0]! + GAP,
    PAD_X + bottomWs[0]! + GAP + bottomWs[1]! + GAP,
  ];
  const namedCardW = (bottomWs[1]! - GAP * 2) / 3;

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

        <g data-hsm-cluster={independent.id}>
          <ClusterHead
            cluster={independent}
            index={0}
            x={PAD_X}
            y={PAD_Y}
            w={usable}
          />
          {independent.operators.map((op, i) => (
            <OperatorCard
              key={op.id}
              op={op}
              x={PAD_X + i * (topCardW + GAP)}
              y={topCardY}
              w={topCardW}
              h={topCardH}
              looksForLabel={looksForLabel}
              methodLabel={methodLabel}
            />
          ))}
        </g>

        <path
          d={`M ${PAD_X + usable / 2} ${topCardY + topCardH + 4} V ${bottomHeadY - 4}`}
          className="hsm-connector"
        />

        <g data-hsm-cluster={restricted.id}>
          <ClusterHead
            cluster={restricted}
            index={1}
            x={bottomXs[0]!}
            y={bottomHeadY}
            w={bottomWs[0]!}
          />
          {restricted.operators.map((op) => (
            <OperatorCard
              key={op.id}
              op={op}
              x={bottomXs[0]!}
              y={bottomCardY}
              w={bottomWs[0]!}
              h={bottomCardH}
              looksForLabel={looksForLabel}
              methodLabel={methodLabel}
            />
          ))}
        </g>

        <g data-hsm-cluster={named.id}>
          <ClusterHead
            cluster={named}
            index={2}
            x={bottomXs[1]!}
            y={bottomHeadY}
            w={bottomWs[1]!}
          />
          {named.operators.map((op, i) => (
            <OperatorCard
              key={op.id}
              op={op}
              x={bottomXs[1]! + i * (namedCardW + GAP)}
              y={bottomCardY}
              w={namedCardW}
              h={bottomCardH}
              looksForLabel={looksForLabel}
              methodLabel={methodLabel}
            />
          ))}
        </g>

        <g data-hsm-cluster={inLoop.id}>
          <ClusterHead
            cluster={inLoop}
            index={3}
            x={bottomXs[2]!}
            y={bottomHeadY}
            w={bottomWs[2]!}
          />
          {inLoop.operators.map((op) => (
            <OperatorCard
              key={op.id}
              op={op}
              x={bottomXs[2]!}
              y={bottomCardY}
              w={bottomWs[2]!}
              h={bottomCardH}
              looksForLabel={looksForLabel}
              methodLabel={methodLabel}
            />
          ))}
        </g>

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
  stroke-width: 2.2;
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
