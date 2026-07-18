import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type ProcessPipelineNode = {
  id: string;
  label: string;
  sublabel?: string;
};

export type ProcessPipelineLoop = {
  /** Node id where the quality/iteration loop starts. */
  from: string;
  /** Node id where the quality/iteration loop ends. */
  to: string;
  /** Pill caption above the loop (e.g. "QUALITY LOOP · raise the bar"). */
  caption?: string;
  /** Label on the forward arc (from → to). */
  forwardLabel?: string;
  /** Label on the return arc (to → from). */
  backLabel?: string;
};

export interface ProcessPipelineProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: ProcessPipelineNode[];
  /**
   * Optional iteration loop between two nodes. When set, those two nodes are
   * emphasized and connected by a stadium track instead of a straight edge.
   */
  loop?: ProcessPipelineLoop;
  /** Enable stroke/pulse animation (CSS + SMIL). Honors prefers-reduced-motion. */
  animated?: boolean;
}

/**
 * Horizontal process pipeline with an optional dual-direction quality loop.
 *
 * Spacing contract (do not collapse):
 * - Caption pill: top margin + internal padding so text never clips the pill edge
 * - Gap between caption and loop band
 * - Node labels entirely below the loop band with clear clearance
 * - viewBox height derived from the last sublabel
 */
export function ProcessPipeline({
  nodes,
  loop,
  animated = true,
  className,
  ...props
}: ProcessPipelineProps) {
  if (nodes.length < 2) {
    return null;
  }

  // —— Caption pill: text + padding + outer margins ——
  const caption = {
    topMargin: 16,
    height: 30,
    // Wide enough for mono ~10.5px "QUALITY LOOP · raise the bar" + padX*2
    width: 228,
    padX: 18,
    gapBelow: 14,
  };
  const captionText = loop?.caption ?? '';
  const showCaption = Boolean(loop && captionText);
  const captionTop = showCaption ? caption.topMargin : 12;
  const captionBottom = showCaption ? captionTop + caption.height : captionTop;
  const captionCy = captionTop + caption.height / 2;

  // —— Horizontal layout ——
  const width = 640;
  const padX = 52;
  const usable = width - padX * 2;
  const step = nodes.length > 1 ? usable / (nodes.length - 1) : 0;
  const xs = nodes.map((_, i) => padX + i * step);

  const fromIdx = loop ? nodes.findIndex((n) => n.id === loop.from) : -1;
  const toIdx = loop ? nodes.findIndex((n) => n.id === loop.to) : -1;
  const hasLoop = fromIdx >= 0 && toIdx > fromIdx;

  const gx = hasLoop ? xs[fromIdx]! : 0;
  const rx = hasLoop ? xs[toIdx]! : 0;
  const mid = (gx + rx) / 2;
  const loopRx = hasLoop ? (rx - gx) / 2 : 0;
  const loopRy = 38;
  const bandPad = 10;

  // Loop band top clears caption + gap
  const bandTop = hasLoop
    ? captionBottom + (showCaption ? caption.gapBelow : 8)
    : 48;
  const cy = hasLoop ? bandTop + loopRy + bandPad : 72;
  const bandBottom = hasLoop ? cy + loopRy + bandPad : cy + 24;

  // Labels always below band (or below nodes when no loop)
  const labelY = bandBottom + 18;
  const subY = labelY + 16;
  const viewH = subY + 20;

  const qualityLoopPath = hasLoop
    ? `M ${gx} ${cy} A ${loopRx} ${loopRy} 0 0 1 ${rx} ${cy} A ${loopRx} ${loopRy} 0 0 1 ${gx} ${cy}`
    : '';
  const loopTop = hasLoop
    ? `M ${gx} ${cy} A ${loopRx} ${loopRy} 0 0 1 ${rx} ${cy}`
    : '';
  const loopBottom = hasLoop
    ? `M ${rx} ${cy} A ${loopRx} ${loopRy} 0 0 1 ${gx} ${cy}`
    : '';

  // Spine edges excluding the looped segment (fromIdx → toIdx)
  const spinePaths: { d: string; key: string }[] = [];
  if (hasLoop) {
    if (fromIdx > 0) {
      spinePaths.push({
        key: 'to-loop',
        d: `M ${xs[0]} ${cy} H ${gx - 22}`,
      });
    }
    if (toIdx < nodes.length - 1) {
      spinePaths.push({
        key: 'from-loop',
        d: `M ${rx + 22} ${cy} H ${xs[nodes.length - 1]}`,
      });
    }
  } else {
    for (let i = 0; i < nodes.length - 1; i++) {
      spinePaths.push({
        key: `edge-${i}`,
        d: `M ${xs[i]} ${cy} H ${xs[i + 1]}`,
      });
    }
  }

  const uid = React.useId().replace(/:/g, '');

  return (
    <div
      className={cn(
        'glt-process-pipeline w-full overflow-x-auto overflow-y-visible rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)]/40 px-2 py-5 sm:px-4 sm:py-6',
        animated && 'glt-process-pipeline--animated',
        className
      )}
      data-process-pipeline
      data-process-pipeline-loop={hasLoop ? 'true' : undefined}
      {...props}
    >
      <style>{PIPELINE_CSS}</style>
      <svg
        viewBox={`0 0 ${width} ${viewH}`}
        className="mx-auto block h-auto w-full max-w-full"
        role="img"
        overflow="visible"
      >
        <defs>
          <linearGradient id={`${uid}-flow`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--brand-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`${uid}-loop-fill`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.03" />
          </linearGradient>
          <marker
            id={`${uid}-arrow`}
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M1 1.5 L10 6 L1 10.5 Z" fill="var(--brand-primary)" />
          </marker>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {hasLoop ? (
          <>
            <ellipse
              cx={mid}
              cy={cy}
              rx={loopRx + 14}
              ry={loopRy + bandPad}
              fill={`url(#${uid}-loop-fill)`}
            />
            <ellipse
              cx={mid}
              cy={cy}
              rx={loopRx + 14}
              ry={loopRy + bandPad}
              fill="none"
              stroke="color-mix(in srgb, var(--brand-primary) 32%, var(--border-color))"
              strokeWidth="1.25"
              strokeDasharray="3 5"
              className="glt-process-pipeline__loop-band-stroke"
            />
          </>
        ) : null}

        {spinePaths.map((s) => (
          <g key={s.key}>
            <path
              d={s.d}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="glt-process-pipeline__flow"
              d={s.d}
              fill="none"
              stroke={`url(#${uid}-flow)`}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
            />
          </g>
        ))}

        {hasLoop ? (
          <>
            <path
              d={qualityLoopPath}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="3.25"
              strokeLinecap="round"
            />
            <path
              className="glt-process-pipeline__loop-flow glt-process-pipeline__loop-flow--forward"
              d={loopTop}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2.75"
              strokeLinecap="round"
              markerEnd={`url(#${uid}-arrow)`}
              pathLength={100}
            />
            <path
              className="glt-process-pipeline__loop-flow glt-process-pipeline__loop-flow--back"
              d={loopBottom}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2.75"
              strokeLinecap="round"
              markerEnd={`url(#${uid}-arrow)`}
              pathLength={100}
            />

            {showCaption ? (
              <g data-process-pipeline-caption>
                <rect
                  x={mid - caption.width / 2}
                  y={captionTop}
                  width={caption.width}
                  height={caption.height}
                  rx={caption.height / 2}
                  fill="var(--bg-color)"
                  stroke="color-mix(in srgb, var(--brand-primary) 40%, var(--border-color))"
                  strokeWidth="1"
                />
                {/* Invisible hit/pad box documents internal padding */}
                <rect
                  x={mid - caption.width / 2 + caption.padX}
                  y={captionTop + 6}
                  width={caption.width - caption.padX * 2}
                  height={caption.height - 12}
                  fill="transparent"
                  pointerEvents="none"
                />
                <text
                  x={mid}
                  y={captionCy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--brand-primary)"
                  fontSize="10.5"
                  fontWeight="600"
                  fontFamily="var(--font-mono, ui-monospace, monospace)"
                  letterSpacing="0.04em"
                >
                  {captionText}
                </text>
              </g>
            ) : null}

            {loop?.forwardLabel ? (
              <text
                x={mid}
                y={cy - loopRy + 16}
                textAnchor="middle"
                fill="var(--secondary-text-color)"
                fontSize="9.5"
                fontFamily="var(--font-mono, ui-monospace, monospace)"
              >
                {loop.forwardLabel}
              </text>
            ) : null}
            {loop?.backLabel ? (
              <text
                x={mid}
                y={cy + loopRy - 10}
                textAnchor="middle"
                fill="var(--secondary-text-color)"
                fontSize="9.5"
                fontFamily="var(--font-mono, ui-monospace, monospace)"
              >
                {loop.backLabel}
              </text>
            ) : null}

            {animated ? (
              <>
                <circle
                  className="glt-process-pipeline__pulse"
                  r="5"
                  fill="var(--brand-primary)"
                  filter={`url(#${uid}-glow)`}
                >
                  <animateMotion
                    className="glt-process-pipeline__motion"
                    dur="3.4s"
                    repeatCount="indefinite"
                    path={qualityLoopPath}
                  />
                </circle>
                <circle
                  className="glt-process-pipeline__pulse"
                  r="3.5"
                  fill="var(--brand-primary)"
                  opacity="0.7"
                >
                  <animateMotion
                    className="glt-process-pipeline__motion"
                    dur="3.4s"
                    begin="1.7s"
                    repeatCount="indefinite"
                    path={qualityLoopPath}
                  />
                </circle>
              </>
            ) : null}
          </>
        ) : null}

        {spinePaths.map((s) =>
          animated ? (
            <circle
              key={`pulse-${s.key}`}
              className="glt-process-pipeline__pulse"
              r="3.5"
              fill="var(--brand-primary)"
              opacity="0.8"
            >
              <animateMotion
                className="glt-process-pipeline__motion"
                dur="2.2s"
                repeatCount="indefinite"
                path={s.d}
              />
            </circle>
          ) : null
        )}

        {nodes.map((node, i) => {
          const inLoop = hasLoop && (i === fromIdx || i === toIdx);
          const x = xs[i]!;
          return (
            <g key={node.id} data-process-pipeline-node={node.id}>
              {inLoop ? (
                <circle
                  cx={x}
                  cy={cy}
                  r="24"
                  fill="none"
                  stroke="color-mix(in srgb, var(--brand-primary) 22%, transparent)"
                  strokeWidth="5"
                  className="glt-process-pipeline__node-halo"
                />
              ) : null}
              <circle
                cx={x}
                cy={cy}
                r={inLoop ? 18 : 16}
                fill="var(--bg-color)"
                stroke="var(--brand-primary)"
                strokeWidth={inLoop ? 2.75 : 2.25}
              />
              <circle
                className="glt-process-pipeline__node-core"
                cx={x}
                cy={cy}
                r={inLoop ? 7 : 6}
                fill="var(--brand-primary)"
              />
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fill="var(--strong-text-color)"
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-family), system-ui, sans-serif"
              >
                {node.label}
              </text>
              {node.sublabel ? (
                <text
                  x={x}
                  y={subY}
                  textAnchor="middle"
                  fill="var(--secondary-text-color)"
                  fontSize="11"
                  fontFamily="var(--font-mono, ui-monospace, monospace)"
                >
                  {node.sublabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const PIPELINE_CSS = `
.glt-process-pipeline--animated .glt-process-pipeline__flow {
  stroke-dasharray: 16 84;
  stroke-dashoffset: 0;
  animation: glt-pipeline-flow 2.8s linear infinite;
}
.glt-process-pipeline--animated .glt-process-pipeline__loop-flow {
  stroke-dasharray: 22 78;
  stroke-dashoffset: 0;
  animation: glt-pipeline-loop-flow 2.2s linear infinite;
}
.glt-process-pipeline--animated .glt-process-pipeline__loop-flow--back {
  animation-delay: 1.1s;
}
.glt-process-pipeline--animated .glt-process-pipeline__loop-band-stroke {
  animation: glt-pipeline-band 12s linear infinite;
}
.glt-process-pipeline--animated .glt-process-pipeline__node-halo {
  animation: glt-pipeline-halo 2.8s ease-in-out infinite;
}
.glt-process-pipeline--animated .glt-process-pipeline__node-core {
  transform-box: fill-box;
  transform-origin: center;
  animation: glt-pipeline-pulse 2.4s ease-in-out infinite;
}
@keyframes glt-pipeline-flow { to { stroke-dashoffset: -100; } }
@keyframes glt-pipeline-loop-flow { to { stroke-dashoffset: -100; } }
@keyframes glt-pipeline-band { to { stroke-dashoffset: -64; } }
@keyframes glt-pipeline-halo {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.95; }
}
@keyframes glt-pipeline-pulse {
  0%, 100% { opacity: 0.6; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .glt-process-pipeline--animated .glt-process-pipeline__flow,
  .glt-process-pipeline--animated .glt-process-pipeline__loop-flow,
  .glt-process-pipeline--animated .glt-process-pipeline__loop-band-stroke,
  .glt-process-pipeline--animated .glt-process-pipeline__node-halo,
  .glt-process-pipeline--animated .glt-process-pipeline__node-core {
    animation: none !important;
  }
  .glt-process-pipeline--animated .glt-process-pipeline__node-core {
    opacity: 1;
    transform: none;
  }
  .glt-process-pipeline--animated .glt-process-pipeline__motion {
    display: none;
  }
  .glt-process-pipeline--animated .glt-process-pipeline__pulse {
    display: none;
  }
}
`;

export default ProcessPipeline;
