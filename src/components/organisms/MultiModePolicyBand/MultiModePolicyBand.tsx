/**
 * Multi-mode interview band with dual layers: preferred practice (solid modes)
 * vs published policy text (ghost / empty). Encodes preferred-vs-published boundary.
 * One fluid animated SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";
import {
  OPERATING_DETAIL_MAX_CHARS,
  wrapLines,
} from "./wrapLines.js";

export type MultiModeStage = {
  id: string;
  n: string;
  label: string;
  intent: string;
  /** What the mode measures. */
  measures: string;
};

export type MultiModeOperatingItem = {
  id: string;
  label: string;
  detail: string;
};

export type MultiModePolicyBandProps = {
  modes: readonly MultiModeStage[];
  operatingLabel?: string;
  operatingItems?: readonly MultiModeOperatingItem[];
  preferredLabel?: string;
  publishedLabel?: string;
  publishedStatus?: string;
  claim?: string;
  preferredCites?: readonly RefCiteItem[];
  publishedCites?: readonly RefCiteItem[];
  operatingCites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

const VB_W = 960;
const VB_H = 480;

export function MultiModePolicyBand({
  modes,
  operatingLabel = "Operating baseline",
  operatingItems,
  preferredLabel = "Preferred practice · Head of Engineering",
  publishedLabel = "Published how-we-hire text",
  publishedStatus = "Eng guide + Careers FAQ · multi-mode band not documented",
  claim = "Preferred practice is evidence. Policy text is a separate artifact.",
  preferredCites,
  publishedCites,
  operatingCites,
  title = "",
  description = "",
  className,
}: MultiModePolicyBandProps) {
  if (modes.length < 2) return null;

  const padX = 36;
  const gap = 14;
  const usable = VB_W - padX * 2;
  const ops = operatingItems ?? [];
  const opH = ops.length > 0 ? 86 : 0;
  const colW = (usable - gap * (modes.length - 1)) / modes.length;
  const modeY = ops.length > 0 ? 124 : 52;
  const modeH = 150;
  const cols = modes.map((m, i) => ({
    ...m,
    x: padX + i * (colW + gap),
  }));
  const policyY = modeY + modeH + 34;

  return (
    <div
      className={["mmp w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="multi-mode-policy-band"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={title || description ? "mmp-title mmp-desc" : undefined}
        aria-label={!title && !description ? "Multi-mode policy band" : undefined}
      >
        <title id="mmp-title">{title}</title>
        <desc id="mmp-desc">{description}</desc>

        {ops.length > 0 ? (
          <g data-mmp-operating="true">
            <text x={padX} y={22} className="mmp-layer-title">
              {operatingLabel}
            </text>
            {operatingCites && operatingCites.length > 0 ? (
              <SvgRefCite items={operatingCites} x={padX + 200} y={20} fontSize={14} />
            ) : null}
            {ops.map((item, i) => {
              const tw = (usable - gap * (ops.length - 1)) / ops.length;
              const x = padX + i * (tw + gap);
              return (
                <g key={item.id}>
                  <rect x={x} y={30} width={tw} height={opH - 8} rx={10} className="mmp-op-chip" />
                  <text x={x + 12} y={46} className="mmp-op-label">
                    {item.label}
                  </text>
                  <text x={x + 12} y={62} className="mmp-op-detail">
                    {wrapLines(item.detail, OPERATING_DETAIL_MAX_CHARS).map(
                      (line, li) => (
                        <tspan
                          key={`${item.id}-d-${li}`}
                          x={x + 12}
                          dy={li === 0 ? 0 : 13}
                        >
                          {line}
                        </tspan>
                      ),
                    )}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}

        <text x={padX} y={modeY - 10} className="mmp-layer-title">
          {preferredLabel}
        </text>
        {preferredCites && preferredCites.length > 0 ? (
          <SvgRefCite items={preferredCites} x={padX + 280} y={modeY - 12} fontSize={14} />
        ) : null}

        {cols.map((c, i) => (
          <g key={c.id} data-mmp-mode={c.id}>
            {i < cols.length - 1 ? (
              <path
                d={`M ${c.x + colW + 2} ${modeY + modeH / 2} H ${c.x + colW + gap - 2}`}
                className="mmp-connector"
              />
            ) : null}
            <rect x={c.x} y={modeY} width={colW} height={modeH} rx={14} className="mmp-mode-card" />
            <circle cx={c.x + 28} cy={modeY + 28} r={14} className="mmp-mode-ring" />
            <text x={c.x + 28} y={modeY + 28} textAnchor="middle" dominantBaseline="middle" className="mmp-n">
              {c.n}
            </text>
            <text x={c.x + 52} y={modeY + 24} className="mmp-label">
              {c.label}
            </text>
            <text x={c.x + 52} y={modeY + 42} className="mmp-intent">
              {c.intent}
            </text>
            <text x={c.x + 18} y={modeY + 78} className="mmp-measures-kicker">
              Measures
            </text>
            <text x={c.x + 18} y={modeY + 100}>
              {wrapLines(c.measures, 28).map((line, li) => (
                <tspan
                  key={`${c.id}-m-${li}`}
                  x={c.x + 18}
                  dy={li === 0 ? 0 : 16}
                  className="mmp-measures"
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        {/* Published policy ghost layer */}
        <text x={padX} y={policyY - 10} className="mmp-layer-title mmp-layer-title--muted">
          {publishedLabel}
        </text>
        {publishedCites && publishedCites.length > 0 ? (
          <SvgRefCite items={publishedCites} x={padX + 220} y={policyY - 12} fontSize={14} />
        ) : null}
        <rect
          x={padX}
          y={policyY}
          width={usable}
          height={48}
          rx={12}
          className="mmp-policy-ghost"
        />
        <text
          x={VB_W / 2}
          y={policyY + 25}
          textAnchor="middle"
          dominantBaseline="middle"
          className="mmp-policy-status"
        >
          {publishedStatus}
        </text>

        <text x={VB_W / 2} y={VB_H - 14} textAnchor="middle" className="mmp-claim">
          {claim}
        </text>
      </svg>
    </div>
  );
}

const css = `
.mmp-layer-title {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-layer-title--muted {
  fill: var(--secondary-text-color);
  font-weight: 600;
}
.mmp-op-chip {
  fill: color-mix(in srgb, var(--card-bg-color) 80%, var(--bg-color));
  stroke: var(--border-color);
  stroke-width: 1;
}
.mmp-op-label {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-op-detail {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-mode-card {
  fill: var(--bg-color);
  stroke: var(--brand-primary);
  stroke-width: 1.75;
}
.mmp-mode-ring {
  fill: color-mix(in srgb, var(--brand-primary) 12%, var(--bg-color));
  stroke: var(--brand-primary);
  stroke-width: 2;
}
.mmp-n {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mmp-label {
  fill: var(--strong-text-color);
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-intent {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.mmp-measures-kicker {
  fill: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.mmp-measures {
  fill: var(--secondary-text-color);
  font-size: var(--text-sm);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-connector {
  stroke: var(--brand-primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 8 92;
  animation: mmp-flow 2.4s linear infinite;
}
.mmp-policy-ghost {
  fill: color-mix(in srgb, var(--card-bg-color) 70%, transparent);
  stroke: var(--border-color);
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}
.mmp-policy-status {
  fill: var(--secondary-text-color);
  font-size: var(--text-lg);
  font-family: var(--font-family), system-ui, sans-serif;
}
.mmp-claim {
  fill: var(--secondary-text-color);
  font-size: var(--text-base);
  font-style: italic;
  font-family: var(--font-family), system-ui, sans-serif;
}
@keyframes mmp-flow { to { stroke-dashoffset: -100; } }
@media (prefers-reduced-motion: reduce) {
  .mmp-connector { animation: none !important; stroke-dasharray: none; }
}
`;

export default MultiModePolicyBand;
