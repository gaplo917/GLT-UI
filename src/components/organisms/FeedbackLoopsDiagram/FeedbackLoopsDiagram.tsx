/**
 * Animated multi-loop feedback diagram.
 * Thin stroke arcs + sharp triangular heads; each loop pair rotates as a full circle.
 * Theme tokens; reduced-motion. One fluid SVG for every viewport.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

export type FeedbackLoopDef = {
  id: string;
  titleTop: string;
  titleBot: string;
  pace: string;
};

export type FeedbackLoopNode = {
  lines: readonly string[];
};

export type FeedbackLoopsDiagramProps = {
  loops: readonly FeedbackLoopDef[];
  /** Node labels between / outside loops (typically loops.length + 1). */
  nodes: readonly FeedbackLoopNode[];
  /** Shared sources as native SVG `<a>` under the loops (article only). */
  cite?: readonly RefCiteItem[];
  heading?: string;
  title?: string;
  description?: string;
};

/** Point on circle; 0° = east, degrees clockwise (SVG-friendly). */
function pt(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

/** Open arc path (center at 0,0), clockwise from `fromDeg` to `toDeg`. */
function arcPath(r: number, fromDeg: number, toDeg: number) {
  const a = pt(r, fromDeg);
  const b = pt(r, toDeg);
  let delta = toDeg - fromDeg;
  while (delta < 0) delta += 360;
  while (delta >= 360) delta -= 360;
  const large = delta > 180 ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

function headBackDeg(r: number, size: number) {
  return (size / r) * (180 / Math.PI);
}

/**
 * Sharp filled arrowhead at the end of a clockwise arc.
 * Tip and base center both lie on the stroke circle.
 */
function sharpHead(r: number, tipDeg: number, size: number) {
  const backDeg = headBackDeg(r, size);
  const tip = pt(r, tipDeg);
  const base = pt(r, tipDeg - backDeg);

  let dx = tip.x - base.x;
  let dy = tip.y - base.y;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const nx = -dy;
  const ny = dx;
  const half = size * 0.42;
  const b1 = { x: base.x + nx * half, y: base.y + ny * half };
  const b2 = { x: base.x - nx * half, y: base.y - ny * half };

  return [
    `M ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`,
    `L ${b1.x.toFixed(2)} ${b1.y.toFixed(2)}`,
    `L ${b2.x.toFixed(2)} ${b2.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function MultiLine({
  x,
  y,
  lines,
  className,
  anchor = "middle",
  lineH = 20,
}: {
  x: number;
  y: number;
  lines: readonly string[];
  className: string;
  anchor?: "start" | "middle" | "end";
  lineH?: number;
}) {
  const startY = y - ((lines.length - 1) * lineH) / 2;
  return (
    <text
      x={x}
      y={startY}
      textAnchor={anchor}
      className={className}
      dominantBaseline="central"
    >
      {lines.map((line, i) => (
        <tspan key={`${line}-${i}`} x={x} dy={i === 0 ? 0 : lineH}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function CurvedArrow({
  r,
  fromDeg,
  toDeg,
  strokeWidth,
  headSize,
}: {
  r: number;
  fromDeg: number;
  toDeg: number;
  strokeWidth: number;
  headSize: number;
}) {
  const backDeg = headBackDeg(r, headSize);
  let endStroke = toDeg - backDeg;
  if (endStroke < fromDeg) endStroke += 360;

  return (
    <g className="fld-arrow">
      <path
        d={arcPath(r, fromDeg, endStroke)}
        className="fld-stroke"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <path d={sharpHead(r, toDeg, headSize)} className="fld-head" />
    </g>
  );
}

function LoopPair({
  r,
  strokeWidth,
  headSize,
  delay,
  duration = 8,
}: {
  r: number;
  strokeWidth: number;
  headSize: number;
  delay: number;
  duration?: number;
}) {
  return (
    <g className="fld-spin">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <CurvedArrow
        r={r}
        fromDeg={200}
        toDeg={340}
        strokeWidth={strokeWidth}
        headSize={headSize}
      />
      <CurvedArrow
        r={r}
        fromDeg={20}
        toDeg={160}
        strokeWidth={strokeWidth}
        headSize={headSize}
      />
    </g>
  );
}

/**
 * Animated multi-loop feedback diagram.
 * One SVG for every viewport: fluid viewBox scale (width 100% / height auto).
 */
export function FeedbackLoopsDiagram({
  loops,
  nodes,
  cite,
  heading = "",
  title = "",
  description = "",
}: FeedbackLoopsDiagramProps) {
  const n = Math.max(1, loops.length);
  const vbW = Math.max(640, 180 + (n - 1) * 300 + 180);
  const showCites = Boolean(cite && cite.length > 0);
  const vbH = showCites ? 424 : 400;
  const cy = 200;
  const r = 64;
  const strokeWidth = 3.25;
  const headSize = 14;
  const margin = 180;
  const span = vbW - margin * 2;
  const centers =
    n === 1
      ? [vbW / 2]
      : loops.map((_, i) => margin + (i / (n - 1)) * span);
  const nodeXs: number[] = [];
  if (centers.length > 0) {
    nodeXs.push(centers[0] - r - 22);
    for (let i = 0; i < centers.length - 1; i++) {
      nodeXs.push((centers[i] + centers[i + 1]) / 2);
    }
    nodeXs.push(centers[centers.length - 1] + r + 22);
  }
  const titleY = cy - r - 42;
  const paceY = cy + r + 38;

  return (
    <div className="fld w-full min-w-0" data-figure="feedback-loops-diagram">
      <style>{css}</style>

      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        aria-labelledby={
          title || description ? "fld-title fld-desc" : undefined
        }
        aria-label={!title && !description ? "Feedback loops" : undefined}
      >
        <title id="fld-title">{title}</title>
        <desc id="fld-desc">{description}</desc>

        {heading ? (
          <text x={vbW / 2} y={36} textAnchor="middle" className="fld-heading">
            {heading}
          </text>
        ) : null}

        {centers.map((cx, i) => {
          const loop = loops[i];
          if (!loop) return null;
          return (
            <g key={loop.id}>
              <g transform={`translate(${cx} ${cy})`}>
                <LoopPair
                  r={r}
                  strokeWidth={strokeWidth}
                  headSize={headSize}
                  delay={i * 0.5}
                  duration={8}
                />
              </g>
              <text
                x={cx}
                y={titleY}
                textAnchor="middle"
                className="fld-loop-title"
              >
                <tspan x={cx} dy="0">
                  {loop.titleTop}
                </tspan>
                <tspan x={cx} dy="20">
                  {loop.titleBot}
                </tspan>
              </text>
              <text
                x={cx}
                y={paceY}
                textAnchor="middle"
                dominantBaseline="hanging"
                className="fld-pace"
              >
                {loop.pace}
              </text>
            </g>
          );
        })}

        {nodeXs.map((x, i) => {
          const node = nodes[i];
          if (!node) return null;
          return (
            <MultiLine
              key={node.lines.join("-") + i}
              x={x}
              y={cy}
              lines={node.lines}
              className="fld-node"
              lineH={20}
              anchor={
                i === 0 ? "end" : i === nodeXs.length - 1 ? "start" : "middle"
              }
            />
          );
        })}

        {showCites && cite ? (
          <SvgRefCite items={cite} x={vbW / 2} y={vbH - 14} fontSize={12} />
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.fld-heading {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.fld-loop-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 18px;
  font-weight: 700;
}
.fld-node {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 17px;
  font-weight: 600;
}
.fld-pace {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 17px;
  font-weight: 500;
}
.fld-stroke {
  stroke: var(--strong-text-color, var(--text-color));
  opacity: 0.92;
}
.fld-head {
  fill: var(--strong-text-color, var(--text-color));
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .fld-spin animateTransform {
    display: none;
  }
}
.fld a.svg-ref-cite {
  cursor: pointer;
}
.fld .svg-ref-cite-text {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-weight: 600;
}
.fld a.svg-ref-cite:hover .svg-ref-cite-text,
.fld a.svg-ref-cite:focus-visible .svg-ref-cite-text {
  text-decoration: underline;
  text-underline-offset: 2px;
}
`;

export default FeedbackLoopsDiagram;
