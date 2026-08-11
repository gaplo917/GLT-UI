/**
 * Hiring policy map: dual rails — production AI-mediated work (shared) vs
 * interview AI stance spectrum. Operators sit on the interview rail; vertical
 * “bind” markers show production-vs-interview tension where they diverge.
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type HiringPolicyOperator = {
  id: string;
  label: string;
  /** Interview stance short line. */
  interviewStance: string;
  /**
   * 0 = most restrictive interview AI, 1 = most in-loop.
   * Used for horizontal placement on the interview rail.
   */
  stance: number;
  /** true when production seeks AI collab while interview restricts AI. */
  bind?: boolean;
  citeKey?: string;
};

export type HiringPolicyMapProps = {
  operators: readonly HiringPolicyOperator[];
  productionLabel?: string;
  interviewLabel?: string;
  restrictPole?: string;
  inLoopPole?: string;
  claim?: string;
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 360;

export function HiringPolicyMap({
  operators,
  productionLabel = "Production · AI-mediated work (shared industry premise)",
  interviewLabel = "Interview AI policy (operators diverge)",
  restrictPole = "Restrict / stage-control",
  inLoopPole = "In-loop / fluency scored",
  claim = "Same mediation problem. Different interview answers.",
  cites,
  title = "",
  description = "",
  className,
}: HiringPolicyMapProps) {
  if (operators.length < 2) return null;

  const padX = 56;
  const railW = VB_W - padX * 2;
  const prodY = 72;
  const intY = 210;
  const sorted = [...operators].sort((a, b) => a.stance - b.stance);
  const nodes = sorted.map((op) => {
    const t = Math.min(1, Math.max(0, op.stance));
    return {
      ...op,
      x: padX + 40 + t * (railW - 80),
    };
  });
  const showCites = Boolean(cites);

  return (
    <div
      className={["hpm w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="hiring-policy-map"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "hpm-title hpm-desc" : undefined}
        aria-label={!title && !description ? "Hiring policy map" : undefined}
      >
        <title id="hpm-title">{title}</title>
        <desc id="hpm-desc">{description}</desc>

        {/* Production rail */}
        <text x={padX} y={34} className="hpm-rail-title">
          {productionLabel}
        </text>
        <rect x={padX} y={prodY - 14} width={railW} height={28} rx={14} className="hpm-prod-rail" />
        <path
          d={`M ${padX + 16} ${prodY} H ${padX + railW - 16}`}
          className="hpm-prod-flow"
          pathLength={100}
        />
        <text x={VB_W / 2} y={prodY + 1} textAnchor="middle" dominantBaseline="middle" className="hpm-prod-text">
          Models draft · humans direct, review, own
        </text>

        {/* Interview rail */}
        <text x={padX} y={intY - 48} className="hpm-rail-title">
          {interviewLabel}
        </text>
        <text x={padX} y={intY - 28} className="hpm-pole">
          {restrictPole}
        </text>
        <text x={VB_W - padX} y={intY - 28} textAnchor="end" className="hpm-pole">
          {inLoopPole}
        </text>
        <line
          x1={padX}
          y1={intY}
          x2={padX + railW}
          y2={intY}
          className="hpm-int-rail"
        />
        <path
          d={`M ${padX + 8} ${intY} H ${padX + railW - 8}`}
          className="hpm-int-flow"
          pathLength={100}
        />

        {/* Operators */}
        {nodes.map((n) => {
          const tileCites = n.citeKey ? cites?.[n.citeKey] : undefined;
          return (
            <g key={n.id} data-hpm-op={n.id}>
              {n.bind ? (
                <>
                  <line
                    x1={n.x}
                    y1={prodY + 18}
                    x2={n.x}
                    y2={intY - 28}
                    className="hpm-bind"
                  />
                  <text x={n.x + 8} y={(prodY + intY) / 2} className="hpm-bind-label">
                    bind
                  </text>
                </>
              ) : (
                <line
                  x1={n.x}
                  y1={prodY + 18}
                  x2={n.x}
                  y2={intY - 28}
                  className="hpm-align"
                />
              )}
              <circle cx={n.x} cy={intY} r={12} className="hpm-node-ring" />
              <circle cx={n.x} cy={intY} r={5.5} className="hpm-node-core" />
              <text x={n.x} y={intY + 28} textAnchor="middle" className="hpm-label">
                {n.label}
              </text>
              <text x={n.x} y={intY + 44} textAnchor="middle" className="hpm-stance">
                {n.interviewStance}
              </text>
              {showCites && tileCites && tileCites.length > 0 ? (
                <SvgRefCite items={tileCites} x={n.x} y={intY + 58} fontSize={10} />
              ) : null}
            </g>
          );
        })}

        <text x={VB_W / 2} y={VB_H - 18} textAnchor="middle" className="hpm-claim">
          {claim}
        </text>
      </svg>
    </div>
  );
}

const css = `
.hpm-rail-title {
  fill: var(--strong-text-color);
  font-size: 12.5px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hpm-prod-rail {
  fill: color-mix(in srgb, var(--brand-primary) 10%, var(--card-bg-color));
  stroke: color-mix(in srgb, var(--brand-primary) 35%, var(--border-color));
  stroke-width: 1;
}
.hpm-prod-flow {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 2;
  stroke-dasharray: 12 88;
  opacity: 0.55;
  animation: hpm-flow 2.8s linear infinite;
}
.hpm-prod-text {
  fill: var(--brand-primary);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hpm-pole {
  fill: var(--secondary-text-color);
  font-size: 11px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hpm-int-rail {
  stroke: var(--border-color);
  stroke-width: 3;
  stroke-linecap: round;
}
.hpm-int-flow {
  fill: none;
  stroke: color-mix(in srgb, var(--brand-primary) 70%, var(--border-color));
  stroke-width: 2.5;
  stroke-dasharray: 10 90;
  animation: hpm-flow 3.2s linear infinite;
}
.hpm-bind {
  stroke: color-mix(in srgb, var(--brand-primary) 50%, #c45c26);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}
.hpm-align {
  stroke: color-mix(in srgb, var(--border-color) 80%, transparent);
  stroke-width: 1;
  stroke-dasharray: 2 5;
}
.hpm-bind-label {
  fill: color-mix(in srgb, var(--brand-primary) 60%, #c45c26);
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hpm-node-ring {
  fill: var(--bg-color);
  stroke: var(--brand-primary);
  stroke-width: 2.25;
}
.hpm-node-core {
  fill: var(--brand-primary);
  animation: hpm-pulse 2.2s ease-in-out infinite;
}
.hpm-label {
  fill: var(--strong-text-color);
  font-size: 12.5px;
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.hpm-stance {
  fill: var(--secondary-text-color);
  font-size: 10.5px;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hpm-claim {
  fill: var(--secondary-text-color);
  font-size: 12.5px;
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes hpm-flow { to { stroke-dashoffset: -100; } }
@keyframes hpm-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .hpm-prod-flow, .hpm-int-flow, .hpm-node-core { animation: none !important; }
  .hpm-prod-flow, .hpm-int-flow { stroke-dasharray: none; }
}
`;

export default HiringPolicyMap;
