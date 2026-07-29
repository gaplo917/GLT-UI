/**
 * Agent harness architecture diagram.
 * Human steers Guides + Sensors; feedforward/feedback into the coding agent;
 * durable state store/retrieve; ratchet elbow back into the harness.
 * One fluid SVG. Straight / elbow connectors; animated loop pairs.
 */

/** Labels for fixed architecture chrome (host supplies product language). */
export type AgentHarnessLabels = {
  ariaLabel?: string;
  diagramTitle?: string;
  human?: string;
  humanSteering?: string;
  humanGoals?: string;
  harness?: string;
  guides?: string;
  guidesSub?: string;
  sensors?: string;
  sensorsSub?: string;
  feedforward?: string;
  feedback?: string;
  agent?: string;
  agentSub?: string;
  initialGen?: string;
  initialGenLines?: readonly string[];
  selfCorrecting?: string;
  selfCorrectingLines?: readonly string[];
  store?: string;
  retrieve?: string;
  durableState?: string;
  durableStateSub?: string;
  ratchet?: string;
};

export type AgentHarnessDiagramProps = {
  guideItems: readonly string[];
  sensorItems: readonly string[];
  labels?: AgentHarnessLabels;
  title?: string;
  description?: string;
};

/** Shared layout rhythm (viewBox units). */
const GAP = 16;
const PAD = 14;
const R = 12;

const DEFAULT_LABELS: Required<
  Omit<AgentHarnessLabels, "initialGenLines" | "selfCorrectingLines">
> & {
  initialGenLines: readonly string[];
  selfCorrectingLines: readonly string[];
} = {
  ariaLabel: "Agent harness diagram",
  diagramTitle: "Agent = Model + Harness",
  human: "Human",
  humanSteering: "Steering",
  humanGoals: "Goals · merge",
  harness: "Harness",
  guides: "Guides",
  guidesSub: "Feedforward · before the agent acts",
  sensors: "Sensors",
  sensorsSub: "Feedback · while the agent acts",
  feedforward: "feedforward",
  feedback: "feedback",
  agent: "Coding agent",
  agentSub: "Model + tools",
  initialGen: "Initial generation",
  initialGenLines: ["Model · skills · MCP", "Tools · descriptions"],
  selfCorrecting: "Self-correcting",
  selfCorrectingLines: [
    "Orchestration · handoffs",
    "Sandbox · browser",
    "Linters · types",
  ],
  store: "store",
  retrieve: "retrieve",
  durableState: "Durable state",
  durableStateSub: "Store outside context window",
  ratchet: "Every failure becomes a permanent harness rule",
};

export function AgentHarnessDiagram({
  guideItems,
  sensorItems,
  labels: labelsProp,
  title = "",
  description = "",
}: AgentHarnessDiagramProps) {
  const L = { ...DEFAULT_LABELS, ...labelsProp };

  const vbW = 1000;
  const vbH = 500;

  const humanW = 120;
  const wrapW = 400;
  const agentW = 200;
  const loopChannel = 108;
  const contentH = 280;
  const humanH = 160;

  const left = 20;
  const wrap = {
    x: left + humanW + GAP * 1.25,
    y: 56,
    w: wrapW,
    h: contentH + 40,
  };
  const agent = {
    x: wrap.x + wrap.w + loopChannel,
    y: wrap.y + 8,
    w: agentW,
    h: wrap.h - 16,
  };

  const innerW = wrap.w - PAD * 2;
  const panelGap = GAP;
  const headerBand = 22;
  const panelH = (wrap.h - headerBand - PAD * 2 - panelGap) / 2;
  const guides = {
    x: wrap.x + PAD,
    y: wrap.y + headerBand + PAD,
    w: innerW,
    h: panelH,
  };
  const sensors = {
    x: wrap.x + PAD,
    y: guides.y + guides.h + panelGap,
    w: innerW,
    h: panelH,
  };

  const stackH = guides.h + panelGap + sensors.h;
  const human = {
    x: left,
    y: guides.y + (stackH - humanH) / 2,
    w: humanW,
    h: humanH,
  };

  const humanRight = human.x + human.w;
  const guidesMidY = guides.y + guides.h / 2;
  const sensorsMidY = sensors.y + sensors.h / 2;
  const wrapRight = wrap.x + wrap.w;
  const agentLeft = agent.x;
  const agentCx = agent.x + agent.w / 2;

  const loopCx = (wrapRight + agentLeft) / 2;
  const loopCy = (guidesMidY + sensorsMidY) / 2;
  const loopR = Math.min(34, (agentLeft - wrapRight) / 2 - 8);

  const repoW = Math.max(agent.w, 200);
  const repoH = 58;
  const repoLoopGap = 72;
  const repo = {
    x: agent.x + (agent.w - repoW) / 2,
    y: agent.y + agent.h + repoLoopGap,
    w: repoW,
    h: repoH,
  };
  const repoCx = repo.x + repo.w / 2;
  const repoLoopCx = repoCx;
  const repoLoopCy = (agent.y + agent.h + repo.y) / 2;
  const repoLoopR = Math.min(22, (repo.y - (agent.y + agent.h)) / 2 - 6);

  const wrapBottom = wrap.y + wrap.h;
  const wrapCx = wrap.x + wrap.w / 2;
  const durableLeft = repo.x;
  const durableMidY = repo.y + repo.h / 2;
  const ratchetElbowD = [
    `M ${durableLeft} ${durableMidY}`,
    `L ${wrapCx} ${durableMidY}`,
    `L ${wrapCx} ${wrapBottom}`,
  ].join(" ");
  const ratchetLabelX = (durableLeft + wrapCx) / 2;
  const ratchetLabelY = durableMidY - 12;

  return (
    <div className="ahd w-full min-w-0" data-figure="agent-harness-diagram">
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-5xl"
        role="img"
        aria-labelledby={title || description ? "ahd-title ahd-desc" : undefined}
        aria-label={!title && !description ? L.ariaLabel : undefined}
      >
        <title id="ahd-title">{title}</title>
        <desc id="ahd-desc">{description}</desc>

        <defs>
          <marker
            id="ahd-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="ahd-marker" />
          </marker>
          <marker
            id="ahd-arrow-brand"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="ahd-marker-brand" />
          </marker>
          <path id="ahd-ratchet-track" d={ratchetElbowD} fill="none" />
        </defs>

        {L.diagramTitle ? (
          <text x={vbW / 2} y={32} textAnchor="middle" className="ahd-title">
            {L.diagramTitle}
          </text>
        ) : null}

        <rect
          x={human.x}
          y={human.y}
          width={human.w}
          height={human.h}
          rx={R}
          className="ahd-box"
        />
        <text
          x={human.x + human.w / 2}
          y={human.y + human.h / 2 - 18}
          textAnchor="middle"
          className="ahd-box-title"
        >
          {L.human}
        </text>
        <text
          x={human.x + human.w / 2}
          y={human.y + human.h / 2 + 6}
          textAnchor="middle"
          className="ahd-box-sub"
        >
          {L.humanSteering}
        </text>
        <text
          x={human.x + human.w / 2}
          y={human.y + human.h / 2 + 26}
          textAnchor="middle"
          className="ahd-box-sub"
        >
          {L.humanGoals}
        </text>

        <line
          x1={humanRight}
          y1={guidesMidY}
          x2={guides.x}
          y2={guidesMidY}
          className="ahd-edge"
          markerEnd="url(#ahd-arrow)"
        />
        <line
          x1={humanRight}
          y1={sensorsMidY}
          x2={sensors.x}
          y2={sensorsMidY}
          className="ahd-edge"
          markerEnd="url(#ahd-arrow)"
        />

        <rect
          x={wrap.x}
          y={wrap.y}
          width={wrap.w}
          height={wrap.h}
          rx={R}
          className="ahd-box ahd-wrap"
        />
        <text x={wrap.x + PAD} y={wrap.y + 18} className="ahd-frame-label">
          {L.harness}
        </text>

        <rect
          x={guides.x}
          y={guides.y}
          width={guides.w}
          height={guides.h}
          rx={R - 2}
          className="ahd-panel"
        />
        <text x={guides.x + PAD} y={guides.y + 22} className="ahd-panel-title">
          {L.guides}
        </text>
        <text x={guides.x + PAD} y={guides.y + 40} className="ahd-panel-sub">
          {L.guidesSub}
        </text>
        <TileGrid
          x={guides.x + PAD}
          y={guides.y + 52}
          w={guides.w - PAD * 2}
          h={guides.h - 64}
          items={guideItems}
          cols={2}
        />

        <rect
          x={sensors.x}
          y={sensors.y}
          width={sensors.w}
          height={sensors.h}
          rx={R - 2}
          className="ahd-panel"
        />
        <text x={sensors.x + PAD} y={sensors.y + 22} className="ahd-panel-title">
          {L.sensors}
        </text>
        <text x={sensors.x + PAD} y={sensors.y + 40} className="ahd-panel-sub">
          {L.sensorsSub}
        </text>
        <TileGrid
          x={sensors.x + PAD}
          y={sensors.y + 52}
          w={sensors.w - PAD * 2}
          h={sensors.h - 64}
          items={sensorItems}
          cols={2}
        />

        <text
          x={loopCx}
          y={loopCy - loopR - 14}
          textAnchor="middle"
          className="ahd-loop-label"
        >
          {L.feedforward}
        </text>
        <g transform={`translate(${loopCx} ${loopCy})`}>
          <LoopPair r={loopR} strokeWidth={2.25} headSize={12} duration={9} />
        </g>
        <text
          x={loopCx}
          y={loopCy + loopR + 20}
          textAnchor="middle"
          className="ahd-loop-label"
        >
          {L.feedback}
        </text>

        <rect
          x={agent.x}
          y={agent.y}
          width={agent.w}
          height={agent.h}
          rx={R}
          className="ahd-box"
        />
        <text
          x={agentCx}
          y={agent.y + 32}
          textAnchor="middle"
          className="ahd-box-title"
        >
          {L.agent}
        </text>
        <text x={agentCx} y={agent.y + 52} textAnchor="middle" className="ahd-box-sub">
          {L.agentSub}
        </text>

        <rect
          x={agent.x + PAD}
          y={agent.y + 72}
          width={agent.w - PAD * 2}
          height={(agent.h - 72 - PAD * 2 - GAP) / 2}
          rx={R - 2}
          className="ahd-panel"
        />
        <text
          x={agentCx}
          y={agent.y + 72 + 36}
          textAnchor="middle"
          className="ahd-panel-title"
        >
          {L.initialGen}
        </text>
        {L.initialGenLines.map((line, i) => (
          <text
            key={line}
            x={agentCx}
            y={agent.y + 72 + 56 + i * 18}
            textAnchor="middle"
            className="ahd-box-sub"
          >
            {line}
          </text>
        ))}

        {(() => {
          const cardH = (agent.h - 72 - PAD * 2 - GAP) / 2;
          const y2 = agent.y + 72 + cardH + GAP;
          return (
            <>
              <rect
                x={agent.x + PAD}
                y={y2}
                width={agent.w - PAD * 2}
                height={cardH}
                rx={R - 2}
                className="ahd-panel"
              />
              <text
                x={agentCx}
                y={y2 + 32}
                textAnchor="middle"
                className="ahd-panel-title"
              >
                {L.selfCorrecting}
              </text>
              {L.selfCorrectingLines.map((line, i) => (
                <text
                  key={line}
                  x={agentCx}
                  y={y2 + 50 + i * 16}
                  textAnchor="middle"
                  className="ahd-box-sub"
                >
                  {line}
                </text>
              ))}
            </>
          );
        })()}

        <text
          x={repoLoopCx - repoLoopR - 8}
          y={repoLoopCy + 4}
          textAnchor="end"
          className="ahd-loop-label"
        >
          {L.store}
        </text>
        <g transform={`translate(${repoLoopCx} ${repoLoopCy})`}>
          <LoopPair r={repoLoopR} strokeWidth={2} headSize={10} duration={8} />
        </g>
        <text
          x={repoLoopCx + repoLoopR + 8}
          y={repoLoopCy + 4}
          textAnchor="start"
          className="ahd-loop-label"
        >
          {L.retrieve}
        </text>

        <rect
          x={repo.x}
          y={repo.y}
          width={repo.w}
          height={repo.h}
          rx={R}
          className="ahd-box ahd-wrap"
        />
        <text x={repoCx} y={repo.y + 24} textAnchor="middle" className="ahd-box-title">
          {L.durableState}
        </text>
        <text x={repoCx} y={repo.y + 44} textAnchor="middle" className="ahd-box-sub">
          {L.durableStateSub}
        </text>

        <path
          d={ratchetElbowD}
          fill="none"
          className="ahd-edge ahd-edge-ratchet"
          markerEnd="url(#ahd-arrow-brand)"
        />
        <text
          x={ratchetLabelX}
          y={ratchetLabelY}
          textAnchor="middle"
          className="ahd-ratchet-label"
        >
          {L.ratchet}
        </text>
        <g className="ahd-ratchet-pulse" aria-hidden>
          <circle r={5} className="ahd-pulse-dot">
            <animateMotion dur="5s" repeatCount="indefinite" rotate="0">
              <mpath href="#ahd-ratchet-track" />
            </animateMotion>
          </circle>
          <circle r={10} className="ahd-pulse-halo">
            <animateMotion dur="5s" repeatCount="indefinite" rotate="0">
              <mpath href="#ahd-ratchet-track" />
            </animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  );
}

function pt(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

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
    <g>
      <path
        d={arcPath(r, fromDeg, endStroke)}
        className="ahd-loop-stroke"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <path d={sharpHead(r, toDeg, headSize)} className="ahd-loop-head" />
    </g>
  );
}

function LoopPair({
  r,
  strokeWidth,
  headSize,
  duration = 9,
}: {
  r: number;
  strokeWidth: number;
  headSize: number;
  duration?: number;
}) {
  return (
    <g className="ahd-loop-spin">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        dur={`${duration}s`}
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

function TileGrid({
  x,
  y,
  w,
  h,
  items,
  cols,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  items: readonly string[];
  cols: number;
}) {
  const gap = 10;
  const rows = Math.max(1, Math.ceil(items.length / cols));
  const cellW = (w - gap * (cols - 1)) / cols;
  const cellH = (h - gap * (rows - 1)) / rows;

  return (
    <g>
      {items.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const ix = x + col * (cellW + gap);
        const iy = y + row * (cellH + gap);
        return (
          <g key={`${item}-${i}`}>
            <rect
              x={ix}
              y={iy}
              width={cellW}
              height={cellH}
              rx={8}
              className="ahd-tile"
            />
            <text
              x={ix + cellW / 2}
              y={iy + cellH / 2 + 5}
              textAnchor="middle"
              className="ahd-tile-label"
            >
              {item}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const css = `
.ahd-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.ahd-box {
  fill: var(--card-bg-color, var(--bg-color));
  stroke: color-mix(in srgb, var(--strong-text-color, var(--text-color)) 14%, var(--border-color));
  stroke-width: 1.35;
}
.ahd-box-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 16px;
  font-weight: 700;
}
.ahd-box-sub {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 500;
}
.ahd-frame-label {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.ahd-box.ahd-wrap,
.ahd-wrap {
  stroke: color-mix(in srgb, var(--brand-primary) 55%, var(--border-color));
  stroke-width: 1.75;
}
.ahd-panel {
  fill: color-mix(in srgb, var(--bg-color, #fff) 35%, var(--card-bg-color, var(--bg-color)));
  stroke: color-mix(in srgb, var(--strong-text-color, var(--text-color)) 14%, var(--border-color));
  stroke-width: 1.35;
}
.ahd-panel-title {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  font-weight: 700;
}
.ahd-panel-sub {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 500;
}
.ahd-tile {
  fill: var(--card-bg-color, var(--bg-color));
  stroke: color-mix(in srgb, var(--strong-text-color, var(--text-color)) 14%, var(--border-color));
  stroke-width: 1.35;
}
.ahd-tile-label {
  fill: var(--text-color);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12.5px;
  font-weight: 600;
}
.ahd-edge {
  stroke: color-mix(in srgb, var(--strong-text-color, var(--text-color)) 22%, var(--border-color));
  stroke-width: 1.5;
  stroke-linecap: round;
}
.ahd-marker {
  fill: var(--strong-text-color, var(--text-color));
  fill-opacity: 1;
  opacity: 1;
}
.ahd-marker-brand {
  fill: var(--brand-primary);
  fill-opacity: 1;
  opacity: 1;
}
.ahd-loop-label {
  fill: var(--secondary-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.ahd-loop-stroke {
  stroke: var(--brand-primary);
  opacity: 0.9;
}
.ahd-loop-head {
  fill: var(--brand-primary);
  stroke: none;
  opacity: 1;
}
.ahd-edge-ratchet {
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-dasharray: 5 4;
  opacity: 0.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ahd-ratchet-label {
  fill: var(--brand-primary);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11.5px;
  font-weight: 600;
  font-style: italic;
}
.ahd-pulse-dot {
  fill: var(--brand-primary);
  stroke: var(--card-bg-color, var(--bg-color));
  stroke-width: 1.25;
}
.ahd-pulse-halo {
  fill: color-mix(in srgb, var(--brand-primary) 28%, transparent);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .ahd-loop-spin animateTransform {
    display: none;
  }
  .ahd-ratchet-pulse {
    display: none;
  }
}
`;

export default AgentHarnessDiagram;
