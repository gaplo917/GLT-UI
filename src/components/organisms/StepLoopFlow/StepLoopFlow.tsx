/**
 * Closed step loop: forward pipeline of steps, last step as return node below.
 * One fluid SVG for every viewport. Pulse travels the full loop path.
 */

export type StepLoopStep = {
  n: string;
  label: string;
  detail: string;
  /** Brand stroke/fill on the step box. Default: last step brand; others neutral. */
  tone?: "brand" | "neutral";
};

export type StepLoopFlowProps = {
  /** At least two steps: all but last on the top row; last is the return node. */
  steps: readonly StepLoopStep[];
  returnLabel?: string;
  title?: string;
  description?: string;
  className?: string;
};

/**
 * Closed loop flow diagram.
 * Forward pipeline on the top row; last step closes the loop underneath.
 */
export function StepLoopFlow({
  steps,
  returnLabel = "↻ next item",
  title = "",
  description = "",
  className,
}: StepLoopFlowProps) {
  if (steps.length < 2) {
    return null;
  }

  const vbW = 960;
  const vbH = 300;

  const topSteps = steps.slice(0, -1);
  const returnStep = steps[steps.length - 1];
  const topCount = topSteps.length;

  const boxW = Math.min(140, (vbW - 80) / Math.max(topCount, 1) - 16);
  const boxH = 78;
  const topY = 24;
  const gap = Math.min(24, (vbW - 80 - topCount * boxW) / Math.max(topCount - 1, 1));
  const pipelineW = topCount * boxW + Math.max(0, topCount - 1) * gap;
  const startX = (vbW - pipelineW) / 2;
  const top = topSteps.map((step, i) => ({
    ...step,
    x: startX + i * (boxW + gap),
    y: topY,
    tone: step.tone ?? "neutral",
  }));
  const human = {
    ...returnStep,
    x: (vbW - boxW) / 2,
    y: 188,
    tone: returnStep.tone ?? "brand",
  };
  const ship = top[top.length - 1];
  const triage = top[0];
  const shipCx = ship.x + boxW / 2;
  const triageCx = triage.x + boxW / 2;
  const humanCy = human.y + boxH / 2;
  const humanRight = human.x + boxW;
  const humanLeft = human.x;
  const topBottom = topY + boxH;
  const midY = topY + boxH / 2;
  const r = 18;

  const loopTrackD = (() => {
    const parts: string[] = [];
    parts.push(`M ${top[0].x + boxW} ${midY}`);
    for (let i = 0; i < top.length - 1; i++) {
      parts.push(`L ${top[i + 1].x} ${midY}`);
      parts.push(`L ${top[i + 1].x + boxW / 2} ${midY}`);
      if (i < top.length - 2) {
        parts.push(`L ${top[i + 1].x + boxW} ${midY}`);
      }
    }
    parts.push(`L ${shipCx} ${midY}`);
    parts.push(`L ${shipCx} ${humanCy - r}`);
    parts.push(`Q ${shipCx} ${humanCy} ${shipCx - r} ${humanCy}`);
    parts.push(`L ${humanRight} ${humanCy}`);
    parts.push(`L ${human.x + boxW / 2} ${humanCy}`);
    parts.push(`L ${humanLeft} ${humanCy}`);
    parts.push(`L ${triageCx + r} ${humanCy}`);
    parts.push(`Q ${triageCx} ${humanCy} ${triageCx} ${humanCy - r}`);
    parts.push(`L ${triageCx} ${topBottom}`);
    parts.push(`L ${triageCx} ${midY}`);
    parts.push(`L ${top[0].x + boxW} ${midY}`);
    return parts.join(" ");
  })();

  return (
    <div
      className={["slf w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="step-loop-flow"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-4xl"
        role="img"
        aria-labelledby={
          title || description ? "slf-title slf-desc" : undefined
        }
        aria-label={!title && !description ? "Step loop flow" : undefined}
      >
        <title id="slf-title">{title}</title>
        <desc id="slf-desc">{description}</desc>

        <defs>
          <marker
            id="slf-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="slf-marker" />
          </marker>
          <marker
            id="slf-arrow-brand"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="slf-marker-brand" />
          </marker>

          <path id="slf-loop-track" d={loopTrackD} fill="none" />
        </defs>

        {top.slice(0, -1).map((step, i) => {
          const next = top[i + 1];
          return (
            <line
              key={`e-${step.label}-${i}`}
              x1={step.x + boxW}
              y1={step.y + boxH / 2}
              x2={next.x}
              y2={next.y + boxH / 2}
              className="slf-edge"
              markerEnd="url(#slf-arrow)"
            />
          );
        })}

        <path
          d={`M ${shipCx} ${topBottom}
              L ${shipCx} ${humanCy - r}
              Q ${shipCx} ${humanCy} ${shipCx - r} ${humanCy}
              L ${humanRight} ${humanCy}`}
          fill="none"
          className="slf-edge"
          markerEnd="url(#slf-arrow)"
        />

        <path
          d={`M ${humanLeft} ${humanCy}
              L ${triageCx + r} ${humanCy}
              Q ${triageCx} ${humanCy} ${triageCx} ${humanCy - r}
              L ${triageCx} ${topBottom}`}
          fill="none"
          className="slf-edge slf-edge-return"
          markerEnd="url(#slf-arrow-brand)"
        />

        <g className="slf-pulse">
          <circle r="7" className="slf-pulse-halo">
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
            >
              <mpath href="#slf-loop-track" />
            </animateMotion>
          </circle>
          <circle r="4.25" className="slf-pulse-dot">
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
            >
              <mpath href="#slf-loop-track" />
            </animateMotion>
          </circle>
        </g>

        {top.map((step) => (
          <StepBox
            key={step.label + step.n}
            x={step.x}
            y={step.y}
            w={boxW}
            h={boxH}
            n={step.n}
            label={step.label}
            detail={step.detail}
            tone={step.tone}
          />
        ))}

        <StepBox
          x={human.x}
          y={human.y}
          w={boxW}
          h={boxH}
          n={human.n}
          label={human.label}
          detail={human.detail}
          tone={human.tone}
        />

        {returnLabel ? (
          <text
            x={(humanLeft + triageCx) / 2}
            y={humanCy - 14}
            textAnchor="middle"
            className="slf-return-label"
          >
            {returnLabel}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function StepBox({
  x,
  y,
  w,
  h,
  n,
  label,
  detail,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n: string;
  label: string;
  detail: string;
  tone: "brand" | "neutral";
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        className={`slf-box slf-box--${tone}`}
      />
      <text x={cx} y={y + 24} textAnchor="middle" className="slf-n">
        {n}
      </text>
      <text x={cx} y={y + 46} textAnchor="middle" className="slf-label">
        {label}
      </text>
      <text x={cx} y={y + 64} textAnchor="middle" className="slf-detail">
        {detail}
      </text>
    </g>
  );
}

const css = `
.slf-box {
  stroke-width: 1.5;
}
.slf-box--neutral {
  fill: var(--card-bg-color, var(--bg-color));
  stroke: var(--border-color);
}
.slf-box--brand {
  fill: color-mix(in srgb, var(--brand-primary) 12%, var(--card-bg-color, var(--bg-color)));
  stroke: var(--brand-primary);
}
.slf-n {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}
.slf-label {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 16px;
  font-weight: 700;
}
.slf-detail {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 500;
}
.slf-edge {
  stroke: color-mix(in srgb, var(--strong-text-color, var(--text-color)) 55%, transparent);
  stroke-width: 1.85;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 1;
}
.slf-edge-return {
  stroke: color-mix(in srgb, var(--brand-primary) 88%, transparent);
  stroke-dasharray: 5 4;
  opacity: 1;
}
.slf-marker {
  fill: var(--strong-text-color, var(--text-color));
  fill-opacity: 1;
  opacity: 1;
}
.slf-marker-brand {
  fill: var(--brand-primary);
  fill-opacity: 1;
  opacity: 1;
}
.slf-return-label {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 600;
}
.slf-pulse-dot {
  fill: var(--brand-primary);
  stroke: var(--card-bg-color, var(--bg-color));
  stroke-width: 1.5;
}
.slf-pulse-halo {
  fill: color-mix(in srgb, var(--brand-primary) 32%, transparent);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .slf-pulse {
    display: none;
  }
}
`;

export default StepLoopFlow;
