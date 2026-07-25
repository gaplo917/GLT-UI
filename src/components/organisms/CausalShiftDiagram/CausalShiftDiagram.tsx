/**
 * Two-column causal shift diagram: left chain vs right chain with vertical
 * link chips and a center flip bridge. One fluid SVG for every viewport.
 *
 * Article cites attach to the matching card claim via `cites` (not a footer strip).
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";
import { SvgRefCite } from "@/components/molecules/SvgRefCite/SvgRefCite.js";

/** Observation card on either causal chain. */
export type CausalShiftCard = {
  id: string;
  title: string;
  detail: string;
  /** Brand-highlight this card (stroke + title color). */
  highlight?: boolean;
};

export type CausalShiftDiagramProps = {
  leftChain: readonly CausalShiftCard[];
  rightChain: readonly CausalShiftCard[];
  /** Vertical hinge labels between left cards (length = leftChain.length − 1). */
  leftLinks: readonly string[];
  /** Vertical hinge labels between right cards (length = rightChain.length − 1). */
  rightLinks: readonly string[];
  /**
   * Optional per-card sources (article). Presentation omits cites.
   * Markers sit under each card’s detail line via SVG `<a>` (`SvgRefCite`).
   */
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  claim?: string;
  claimSub?: string;
  leftHeader?: string;
  rightHeader?: string;
  footer?: string;
  title?: string;
  description?: string;
};

/** Approximate chip width for a short hinge label (viewBox units). */
function chipWidth(label: string): number {
  return Math.min(200, Math.max(88, label.length * 7.4 + 28));
}

/**
 * Filled-triangle marker: viewBox 0–10, markerWidth 7, markerUnits strokeWidth.
 * Head length along the path ≈ markerWidth × strokeWidth (viewBox tip at 10).
 */
const CHAIN_STROKE = 1.85;
const ARROWHEAD_LEN = 7 * CHAIN_STROKE; // ~13 viewBox units

/** Midpoint of the shaft only (exclude arrowhead at the line end). */
function shaftCenterY(yStart: number, yEnd: number): number {
  const shaftEnd = yEnd - ARROWHEAD_LEN;
  return (yStart + shaftEnd) / 2;
}

/** Point on a circle centered at origin; 0° = east, degrees clockwise. */
function pt(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

/** Open arc path (center 0,0), clockwise from fromDeg to toDeg. */
function arcArrowPath(r: number, fromDeg: number, toDeg: number) {
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
 * Small filled head on an arc. Tip + base on the stroke circle so the head
 * stays center-aligned with the line.
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
  const half = size * 0.4;
  const b1 = { x: base.x + nx * half, y: base.y + ny * half };
  const b2 = { x: base.x - nx * half, y: base.y - ny * half };
  return [
    `M ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`,
    `L ${b1.x.toFixed(2)} ${b1.y.toFixed(2)}`,
    `L ${b2.x.toFixed(2)} ${b2.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** Curved shaft + on-path filled head (local coords, origin at circle center). */
function FlipCurvedArrow({
  r,
  fromDeg,
  toDeg,
  headSize,
}: {
  r: number;
  fromDeg: number;
  toDeg: number;
  headSize: number;
}) {
  const backDeg = headBackDeg(r, headSize);
  let endStroke = toDeg - backDeg;
  if (endStroke < fromDeg) endStroke += 360;
  return (
    <g>
      <path
        d={arcArrowPath(r, fromDeg, endStroke)}
        className="csd-flip-arc"
        fill="none"
        strokeLinecap="butt"
      />
      <path d={sharpHead(r, toDeg, headSize)} className="csd-flip-head" />
    </g>
  );
}

export function CausalShiftDiagram({
  leftChain,
  rightChain,
  leftLinks,
  rightLinks,
  cites,
  claim = "",
  claimSub = "",
  leftHeader = "",
  rightHeader = "",
  footer = "",
  title = "",
  description = "",
}: CausalShiftDiagramProps) {
  const vbW = 1000;
  const showCites = Boolean(
    cites && Object.values(cites).some((items) => items && items.length > 0),
  );
  const cardH = showCites ? 98 : 86;
  const linkH = 52;
  const firstCardY = 118;
  const chainLen = Math.max(leftChain.length, rightChain.length, 1);
  const lastCardBottom =
    firstCardY + Math.max(0, chainLen - 1) * (cardH + linkH) + cardH;
  const footerY = lastCardBottom + 38;
  const vbH = footerY + 28;

  const padX = 40;
  const colW = 400;
  const leftX = padX;
  const rightX = vbW - padX - colW;
  const midX = vbW / 2;
  const leftCx = leftX + colW / 2;
  const rightCx = rightX + colW / 2;

  const claimY = 28;
  const claimSubY = 52;
  const colHeaderY = 88;

  const cardTop = (i: number) => firstCardY + i * (cardH + linkH);
  const cardBottom = (i: number) => cardTop(i) + cardH;
  const linkLabelY = (i: number) =>
    shaftCenterY(cardBottom(i), cardTop(i + 1));

  // Flip sits on the bridge between first left card and second right card when present
  const leftBridgeIdx = 0;
  const rightBridgeIdx = Math.min(1, Math.max(0, rightChain.length - 1));
  const laborCy = cardTop(leftBridgeIdx) + cardH / 2;
  const judgmentCy = cardTop(rightBridgeIdx) + cardH / 2;
  const laborRight = leftX + colW;
  const judgmentLeft = rightX;
  const flipCx = midX;
  const flipCy = (laborCy + judgmentCy) / 2;
  const flipR = 34;

  const leftEdgeCount = Math.min(leftLinks.length, Math.max(0, leftChain.length - 1));
  const rightEdgeCount = Math.min(
    rightLinks.length,
    Math.max(0, rightChain.length - 1),
  );

  return (
    <div className="csd w-full min-w-0" data-figure="causal-shift-diagram">
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-4xl"
        role="img"
        aria-labelledby={
          title || description ? "csd-title csd-desc" : undefined
        }
        aria-label={!title && !description ? "Causal shift diagram" : undefined}
      >
        <title id="csd-title">{title}</title>
        <desc id="csd-desc">{description}</desc>

        <defs>
          <marker
            id="csd-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="csd-marker" />
          </marker>
          <marker
            id="csd-arrow-brand"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="csd-marker-brand" />
          </marker>
        </defs>

        {claim ? (
          <text x={midX} y={claimY} textAnchor="middle" className="csd-claim">
            {claim}
          </text>
        ) : null}
        {claimSub ? (
          <text
            x={midX}
            y={claimSubY}
            textAnchor="middle"
            className="csd-claim-sub"
          >
            {claimSub}
          </text>
        ) : null}

        {leftHeader ? (
          <text
            x={leftCx}
            y={colHeaderY}
            textAnchor="middle"
            className="csd-era-label"
          >
            {leftHeader}
          </text>
        ) : null}
        {rightHeader ? (
          <text
            x={rightCx}
            y={colHeaderY}
            textAnchor="middle"
            className="csd-era-label"
          >
            {rightHeader}
          </text>
        ) : null}

        {Array.from({ length: leftEdgeCount }, (_, i) => (
          <line
            key={`bl-e-${i}`}
            x1={leftCx}
            y1={cardBottom(i)}
            x2={leftCx}
            y2={cardTop(i + 1)}
            className="csd-chain-edge"
            markerEnd="url(#csd-arrow)"
          />
        ))}
        {Array.from({ length: rightEdgeCount }, (_, i) => (
          <line
            key={`al-e-${i}`}
            x1={rightCx}
            y1={cardBottom(i)}
            x2={rightCx}
            y2={cardTop(i + 1)}
            className="csd-chain-edge"
            markerEnd="url(#csd-arrow)"
          />
        ))}

        {leftChain.length > 0 && rightChain.length > 0 ? (
          <path
            d={[
              `M ${laborRight} ${laborCy}`,
              `C ${flipCx - 20} ${laborCy}, ${flipCx - 20} ${judgmentCy}, ${judgmentLeft} ${judgmentCy}`,
            ].join(" ")}
            fill="none"
            className="csd-flip-bridge"
            markerEnd="url(#csd-arrow-brand)"
          />
        ) : null}

        {leftChain.map((step, i) => {
          const y = cardTop(i);
          const highlight = Boolean(step.highlight);
          const cardCites = cites?.[step.id];
          const titleY = showCites ? y + 32 : y + 36;
          const detailY = showCites ? y + 54 : y + 60;
          return (
            <g key={step.id} data-csd-card={step.id}>
              <rect
                x={leftX}
                y={y}
                width={colW}
                height={cardH}
                rx={14}
                className={highlight ? "csd-card csd-card-brand" : "csd-card"}
              />
              <text
                x={leftCx}
                y={titleY}
                textAnchor="middle"
                className={
                  highlight
                    ? "csd-card-title csd-card-title-brand"
                    : "csd-card-title"
                }
              >
                {step.title}
              </text>
              <text
                x={leftCx}
                y={detailY}
                textAnchor="middle"
                className="csd-card-detail"
              >
                {step.detail}
              </text>
              {cardCites && cardCites.length > 0 ? (
                <SvgRefCite
                  items={cardCites}
                  x={leftCx}
                  y={y + cardH - 16}
                  fontSize={11}
                />
              ) : null}
            </g>
          );
        })}

        {rightChain.map((step, i) => {
          const y = cardTop(i);
          const highlight = Boolean(step.highlight);
          const cardCites = cites?.[step.id];
          const titleY = showCites ? y + 32 : y + 36;
          const detailY = showCites ? y + 54 : y + 60;
          return (
            <g key={step.id} data-csd-card={step.id}>
              <rect
                x={rightX}
                y={y}
                width={colW}
                height={cardH}
                rx={14}
                className={highlight ? "csd-card csd-card-brand" : "csd-card"}
              />
              <text
                x={rightCx}
                y={titleY}
                textAnchor="middle"
                className={
                  highlight
                    ? "csd-card-title csd-card-title-brand"
                    : "csd-card-title"
                }
              >
                {step.title}
              </text>
              <text
                x={rightCx}
                y={detailY}
                textAnchor="middle"
                className="csd-card-detail"
              >
                {step.detail}
              </text>
              {cardCites && cardCites.length > 0 ? (
                <SvgRefCite
                  items={cardCites}
                  x={rightCx}
                  y={y + cardH - 16}
                  fontSize={11}
                />
              ) : null}
            </g>
          );
        })}

        {leftChain.length > 0 && rightChain.length > 0 ? (
          <g className="csd-flip" transform={`translate(${flipCx} ${flipCy})`}>
            <circle r={flipR + 4} className="csd-flip-halo" />
            <circle r={flipR} className="csd-flip-disc" />
            <g className="csd-flip-spin">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="4s"
                repeatCount="indefinite"
              />
              <FlipCurvedArrow
                r={flipR - 12}
                fromDeg={200}
                toDeg={340}
                headSize={7}
              />
              <FlipCurvedArrow
                r={flipR - 12}
                fromDeg={20}
                toDeg={160}
                headSize={7}
              />
            </g>
          </g>
        ) : null}

        {leftLinks.slice(0, leftEdgeCount).map((label, i) => {
          const y = linkLabelY(i);
          const w = chipWidth(label);
          const h = 24;
          return (
            <g key={`bl-c-${label}-${i}`}>
              <rect
                x={leftCx - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx={h / 2}
                className="csd-link-chip"
              />
              <text
                x={leftCx}
                y={y + 4.5}
                textAnchor="middle"
                className="csd-link-chip-label"
              >
                {label}
              </text>
            </g>
          );
        })}

        {rightLinks.slice(0, rightEdgeCount).map((label, i) => {
          const y = linkLabelY(i);
          const w = chipWidth(label);
          const h = 24;
          return (
            <g key={`al-c-${label}-${i}`}>
              <rect
                x={rightCx - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx={h / 2}
                className="csd-link-chip"
              />
              <text
                x={rightCx}
                y={y + 4.5}
                textAnchor="middle"
                className="csd-link-chip-label"
              >
                {label}
              </text>
            </g>
          );
        })}

        {footer ? (
          <text x={midX} y={footerY} textAnchor="middle" className="csd-footer">
            {footer}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

const css = `
.csd-claim {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.csd-claim-sub {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  font-weight: 500;
}
.csd-era-label {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.csd-flip-bridge {
  stroke: var(--brand-primary, #2563eb);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.9;
}
.csd-flip-halo {
  fill: color-mix(in srgb, var(--brand-primary, #2563eb) 14%, transparent);
}
.csd-flip-disc {
  fill: var(--card-bg-color, #111);
  stroke: var(--brand-primary, #2563eb);
  stroke-width: 1.75;
}
.csd-flip-arc {
  stroke: var(--brand-primary, #2563eb);
  stroke-width: 1.75;
  stroke-linecap: butt;
  opacity: 1;
}
.csd-flip-head {
  fill: var(--brand-primary, #2563eb);
  stroke: none;
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .csd-flip-spin animateTransform {
    display: none;
  }
}
.csd-card {
  fill: color-mix(in srgb, var(--card-bg-color, #fff) 94%, transparent);
  stroke: color-mix(in srgb, var(--strong-text-color, #111) 14%, var(--border-color, #ddd));
  stroke-width: 1.35;
}
.csd-card-brand {
  fill: color-mix(in srgb, var(--brand-primary, #2563eb) 9%, var(--card-bg-color, #fff));
  stroke: color-mix(in srgb, var(--brand-primary, #2563eb) 45%, var(--border-color, #ddd));
}
.csd-card-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 16.5px;
  font-weight: 700;
}
.csd-card-title-brand {
  fill: var(--brand-primary, #2563eb);
}
.csd-card-detail {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 13.5px;
  font-weight: 500;
}
.csd-chain-edge {
  stroke: color-mix(in srgb, var(--strong-text-color, #111) 45%, var(--border-color, #ddd));
  stroke-width: 1.85;
  stroke-linecap: round;
  opacity: 1;
}
.csd-marker {
  fill: var(--strong-text-color, var(--text-color));
  fill-opacity: 1;
  opacity: 1;
}
.csd-marker-brand {
  fill: var(--brand-primary, #2563eb);
  fill-opacity: 1;
  opacity: 1;
}
.csd-link-chip {
  fill: var(--card-bg-color, #111);
  stroke: none;
}
.csd-link-chip-label {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12.5px;
  font-weight: 650;
}
.csd-footer {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.csd a.svg-ref-cite {
  cursor: pointer;
}
.csd .svg-ref-cite-text {
  fill: var(--brand-primary, #2563eb);
  font-family: var(--font-family, system-ui, sans-serif);
  font-weight: 600;
}
.csd a.svg-ref-cite:hover .svg-ref-cite-text,
.csd a.svg-ref-cite:focus-visible .svg-ref-cite-text {
  text-decoration: underline;
  text-underline-offset: 2px;
}
`;

export default CausalShiftDiagram;
