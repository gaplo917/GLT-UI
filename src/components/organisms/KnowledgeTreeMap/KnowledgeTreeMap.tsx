/**
 * Knowledge tree map: short map injected into context vs encyclopedia tree on disk.
 * Progressive disclosure layout. One fluid SVG for every viewport.
 */

export type KnowledgeTreeNodeKind =
  | "map"
  | "file"
  | "folder"
  | "leaf"
  | "ellipsis";

export type KnowledgeTreeNode = {
  name: string;
  kind: KnowledgeTreeNodeKind;
  children?: readonly KnowledgeTreeNode[];
};

/** @deprecated Prefer KnowledgeTreeNode — alias kept for callers. */
export type TreeNode = KnowledgeTreeNode;

export type KnowledgeTreeMapProps = {
  /** Repository / knowledge-store tree rendered on the right panel. */
  tree: readonly KnowledgeTreeNode[];
  claim?: string;
  claimSub?: string;
  mapPanelKicker?: string;
  /** Highlight card name on the left (typically the map file). */
  mapName?: string;
  mapMeta?: readonly string[];
  mapFoot?: string;
  storeKicker?: string;
  title?: string;
  description?: string;
  className?: string;
};

const ROW_H = 17;
const TREE_PAD_X = 18;
const TREE_PAD_Y = 4;

function flatten(
  nodes: readonly KnowledgeTreeNode[],
  depth = 0,
): { node: KnowledgeTreeNode; depth: number }[] {
  const out: { node: KnowledgeTreeNode; depth: number }[] = [];
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.children?.length) {
      out.push(...flatten(node.children, depth + 1));
    }
  }
  return out;
}

function rowLabel(node: KnowledgeTreeNode, depth: number): string {
  const pad = "\u00A0\u00A0".repeat(depth);
  if (node.kind === "ellipsis") return `${pad}…`;
  return `${pad}${node.name}`;
}

export function KnowledgeTreeMap({
  tree,
  claim = "",
  claimSub = "",
  mapPanelKicker = "Injected into context",
  mapName,
  mapMeta = ["table of contents"],
  mapFoot = "Stable prefix · cheap to re-read",
  storeKicker = "System of record · knowledge store",
  title = "",
  description = "",
  className,
}: KnowledgeTreeMapProps) {
  const rows = flatten(tree);
  // Dynamic height from row count so host trees of any depth stay in viewBox
  const headerH = 56;
  const bottomPad = 20;
  const treeInnerPad = 32 + TREE_PAD_Y + 8;
  const minPanelH = 220;
  const treeH = Math.max(minPanelH, treeInnerPad + rows.length * ROW_H + 24);
  const vbW = 980;
  const vbH = headerH + treeH + bottomPad;

  const leftW = 220;
  const leftX = 18;
  const leftY = headerH;
  const leftH = treeH;
  const gap = 56;
  const rightX = leftX + leftW + gap;
  const rightW = vbW - rightX - 18;
  const rightY = leftY;
  const rightH = leftH;

  const treeStartY = rightY + 32;

  const leftCx = leftX + leftW / 2;
  const arrowY = leftY + leftH * 0.42;
  const arrowX1 = leftX + leftW + 4;
  const arrowX2 = rightX - 8;

  const resolvedMapName =
    mapName ??
    tree.find((n) => n.kind === "map")?.name ??
    tree[0]?.name ??
    "MAP.md";

  return (
    <div
      className={["ktm w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="knowledge-tree-map"
    >
      <style>{css}</style>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-4xl"
        role="img"
        aria-labelledby={
          title || description ? "ktm-title ktm-desc" : undefined
        }
        aria-label={!title && !description ? "Knowledge tree map" : undefined}
      >
        <title id="ktm-title">{title}</title>
        <desc id="ktm-desc">{description}</desc>

        <defs>
          <marker
            id="ktm-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="ktm-marker" />
          </marker>
        </defs>

        {claim ? (
          <text x={vbW / 2} y={22} textAnchor="middle" className="ktm-claim">
            {claim}
          </text>
        ) : null}
        {claimSub ? (
          <text
            x={vbW / 2}
            y={42}
            textAnchor="middle"
            className="ktm-claim-sub"
          >
            {claimSub}
          </text>
        ) : null}

        <rect
          x={leftX}
          y={leftY}
          width={leftW}
          height={leftH}
          rx={14}
          className="ktm-panel ktm-panel-map"
        />
        <text
          x={leftCx}
          y={leftY + 28}
          textAnchor="middle"
          className="ktm-panel-kicker"
        >
          {mapPanelKicker}
        </text>

        <rect
          x={leftX + 16}
          y={leftY + leftH / 2 - 52}
          width={leftW - 32}
          height={88}
          rx={12}
          className="ktm-map-card"
        />
        <text
          x={leftCx}
          y={leftY + leftH / 2 - 18}
          textAnchor="middle"
          className="ktm-map-name"
        >
          {resolvedMapName}
        </text>
        {mapMeta.map((line, i) => (
          <text
            key={line}
            x={leftCx}
            y={leftY + leftH / 2 + 6 + i * 18}
            textAnchor="middle"
            className="ktm-map-meta"
          >
            {line}
          </text>
        ))}

        {mapFoot ? (
          <text
            x={leftCx}
            y={leftY + leftH - 24}
            textAnchor="middle"
            className="ktm-panel-foot"
          >
            {mapFoot}
          </text>
        ) : null}

        <path
          d={`M ${arrowX1} ${arrowY} L ${arrowX2} ${arrowY}`}
          className="ktm-link"
          fill="none"
          markerEnd="url(#ktm-arrow)"
        />

        <rect
          x={rightX}
          y={rightY}
          width={rightW}
          height={rightH}
          rx={14}
          className="ktm-panel"
        />
        <text
          x={rightX + TREE_PAD_X}
          y={rightY + 24}
          className="ktm-panel-kicker"
        >
          {storeKicker}
        </text>

        {rows.map(({ node, depth }, i) => {
          const y = treeStartY + TREE_PAD_Y + i * ROW_H + ROW_H * 0.7;
          const x = rightX + TREE_PAD_X;
          const isMap = node.kind === "map";
          const isFolder = node.kind === "folder";
          const isEllipsis = node.kind === "ellipsis";
          const labelClass = isMap
            ? "ktm-tree-map"
            : isFolder
              ? "ktm-tree-folder"
              : isEllipsis
                ? "ktm-tree-ellipsis"
                : "ktm-tree-file";
          const label = rowLabel(node, depth);
          const chipW = Math.min(160, 12 + node.name.length * 8);

          return (
            <g key={`${depth}-${node.name}-${i}`}>
              {isMap ? (
                <rect
                  x={x - 6}
                  y={y - 12}
                  width={chipW}
                  height={17}
                  rx={5}
                  className="ktm-tree-map-bg"
                />
              ) : null}
              <text x={x} y={y} className={labelClass}>
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const css = `
.ktm-claim {
  fill: var(--strong-text-color, var(--text-color));
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.ktm-claim-sub {
  fill: var(--brand-primary, #2563eb);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 600;
}
.ktm-panel {
  fill: color-mix(in srgb, var(--card-bg-color, #fff) 88%, transparent);
  stroke: color-mix(in srgb, var(--strong-text-color, #111) 12%, var(--border-color, #ddd));
  stroke-width: 1.25;
}
.ktm-panel-map {
  fill: color-mix(in srgb, var(--brand-primary, #2563eb) 6%, var(--card-bg-color, #fff));
  stroke: color-mix(in srgb, var(--brand-primary, #2563eb) 35%, var(--border-color, #ddd));
}
.ktm-panel-kicker {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.ktm-panel-foot {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 500;
}
.ktm-map-card {
  fill: color-mix(in srgb, var(--brand-primary, #2563eb) 12%, var(--card-bg-color, #fff));
  stroke: color-mix(in srgb, var(--brand-primary, #2563eb) 55%, var(--border-color, #ddd));
  stroke-width: 1.5;
}
.ktm-map-name {
  fill: var(--brand-primary, #2563eb);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 16px;
  font-weight: 700;
}
.ktm-map-meta {
  fill: var(--secondary-text-color, #666);
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 500;
}
.ktm-link {
  stroke: color-mix(in srgb, var(--brand-primary, #2563eb) 75%, var(--border-color, #ddd));
  stroke-width: 1.85;
  stroke-linecap: round;
  opacity: 1;
}
.ktm-marker {
  fill: var(--brand-primary, #2563eb);
  fill-opacity: 1;
  opacity: 1;
}
.ktm-tree-map-bg {
  fill: color-mix(in srgb, var(--brand-primary, #2563eb) 14%, transparent);
}
.ktm-tree-map {
  fill: var(--brand-primary, #2563eb);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
}
.ktm-tree-folder {
  fill: var(--strong-text-color, var(--text-color));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11.5px;
  font-weight: 650;
}
.ktm-tree-file {
  fill: var(--secondary-text-color, #555);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
}
.ktm-tree-ellipsis {
  fill: var(--secondary-text-color, #888);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
}
`;

export default KnowledgeTreeMap;
