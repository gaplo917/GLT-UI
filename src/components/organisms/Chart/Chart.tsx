'use client';

import * as React from 'react';
import ChartJS from 'chart.js/auto';
import type {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType as ChartJsType,
  Plugin,
  Point,
  BubbleDataPoint,
} from 'chart.js';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

/**
 * Chart types accepted by the themed wrapper. `'area'` is sugar for a filled
 * line chart — everything else maps 1:1 to a chart.js type.
 */
export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'scatter'
  | 'bubble';

/** A named slot in the design-system palette, resolved from theme tokens. */
export type ChartColorToken = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';

/** Where to place the legend, or `false` to hide it. */
export type ChartLegend = boolean | 'top' | 'bottom' | 'left' | 'right';

export type ChartPoint = number | Point | BubbleDataPoint;

export interface ChartSeries {
  /** Legend label for this series. */
  label?: string;
  /** Y-values (line/bar/pie/…) or `{x, y, r?}` points (scatter/bubble). */
  data: ChartPoint[];
  /**
   * A palette token (`'brand'`, `'success'`, …), a CSS custom property name
   * (`'--brand-primary'`), or any CSS color. Defaults to the palette slot at
   * this series' index. For a single-series bar without `color`, each bar is
   * coloured from the palette by category (set `color` for monochrome bars).
   */
  color?: ChartColorToken | string;
  /** Fill the area under a line. Defaults to `true` for `type="area"`. */
  fill?: boolean;
  /** Override the rendered type for this series to build a mixed chart. */
  type?: 'line' | 'bar';
  /** Escape hatch: raw chart.js dataset options, deep-merged over the themed ones. */
  dataset?: Partial<ChartDataset>;
}

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Chart type. `'area'` renders a filled line chart. */
  type: ChartType;
  /** Category labels shared across series (the x-axis for line/bar, slice names for pie). */
  labels?: Array<string | number>;
  /** Themed series — the intuitive way to feed data. Ignored when `data` is provided. */
  series?: ChartSeries[];
  /** Escape hatch: a full chart.js data object. Takes precedence over `labels`/`series`. */
  data?: ChartData;
  /** Escape hatch: full chart.js options, deep-merged over the themed defaults. */
  options?: ChartOptions;
  /** Ordered palette overriding the default token sequence. Tokens or CSS colors. */
  palette?: Array<ChartColorToken | string>;
  /** Legend visibility/position. Defaults to `'top'` (hidden for scatter/bubble). */
  legend?: ChartLegend;
  /** Optional heading rendered above the canvas via the Text atom. */
  title?: React.ReactNode;
  /** Optional caption rendered below the canvas via the Text atom. */
  caption?: React.ReactNode;
  /** Stack bar/area series on top of each other. */
  stacked?: boolean;
  /** Show axis grid lines. Defaults to `true`. */
  showGrid?: boolean;
  /** Fixed pixel height. When omitted the chart keeps `aspectRatio`. */
  height?: number;
  /** Width ÷ height ratio when `height` is not set. Defaults to `2`. */
  aspectRatio?: number;
  /** Accessible label for the canvas image. Falls back to `title`. */
  ariaLabel?: string;
  /**
   * Draw on-chart annotations. Defaults to `true`. Set `false` to hide.
   * - Pie / doughnut / polarArea: category + value on slices
   * - Bar / line / radar: numeric value only
   * - Scatter / bubble: series labels with bounding-box collision resolution;
   *   overlapping labels are moved to free slots and connected with a leader
   *   line from the data point
   */
  dataLabels?: boolean;
  /**
   * Wrap long category tick labels to at most this many characters per line
   * (chart.js multi-line ticks). Breaks prefer `, `, ` & `, ` / `, then spaces.
   * Use on horizontal bars / narrow layouts so names are not clipped.
   */
  categoryLabelMaxChars?: number;
  /** Extra chart.js plugins. */
  plugins?: Plugin[];
}

/**
 * Split a long category label into chart.js multi-line tick text.
 * Short labels are returned unchanged; longer ones break at natural
 * boundaries (`, ` / ` & ` / ` / `, then spaces) so axis text stays
 * readable in narrow panels instead of clipping off the canvas edge.
 */
export function wrapCategoryLabel(
  label: string,
  maxCharsPerLine = 18,
): string | string[] {
  const text = String(label).trim();
  if (maxCharsPerLine < 1 || text.length <= maxCharsPerLine) return text;

  // Keep delimiters so ", " / " & " / " / " reattach to the preceding line.
  const tokens = text.split(/(\s*&\s*|,\s*|\s*\/\s*|\s+)/).filter((t) => t.length > 0);
  const lines: string[] = [];
  let current = '';

  for (const token of tokens) {
    const candidate = current + token;
    const trimmedLen = candidate.trimEnd().length;
    if (current && trimmedLen > maxCharsPerLine && !/^[\s,]+$/.test(token)) {
      lines.push(current.trimEnd());
      current = token.replace(/^\s+/, '');
    } else {
      current = candidate;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.length <= 1 ? text : lines;
}

function withWrappedCategoryLabels(data: ChartData, maxChars: number): ChartData {
  if (!data.labels?.length) return data;
  return {
    ...data,
    labels: data.labels.map((label) => {
      if (Array.isArray(label)) return label;
      if (label == null) return label;
      return wrapCategoryLabel(String(label), maxChars);
    }),
  };
}

/** Approx. monospaced-ish width of a UI label character in CSS pixels. */
const CATEGORY_LABEL_CHAR_PX = 7.2;

/**
 * Clamp the requested max line length to what the chart panel can actually
 * show on the category axis so mobile widths wrap instead of clipping.
 */
export function resolveCategoryLabelMaxChars(
  requested: number,
  containerWidth: number,
  indexAxis: 'x' | 'y',
): number {
  if (requested < 1) return requested;
  // Before the panel is measured, prefer a mobile-safe wrap so the first
  // paint does not clip long labels on narrow viewports.
  if (containerWidth <= 0) return Math.min(requested, 14);
  // Horizontal bars: category labels sit on the left (~40% budget).
  // Vertical: x-axis labels can use most of the width.
  const share = indexAxis === 'y' ? 0.4 : 0.85;
  const budget = Math.floor((containerWidth * share) / CATEGORY_LABEL_CHAR_PX);
  // Never go below a readable short line; never above the caller's request.
  return Math.min(requested, Math.max(10, budget));
}

const TOKEN_VARS: Record<ChartColorToken, string> = {
  brand: '--brand-primary',
  info: '--color-info',
  success: '--color-success',
  warning: '--color-warning',
  danger: '--color-danger',
  neutral: '--secondary-text-color',
};

const DEFAULT_PALETTE: ChartColorToken[] = ['brand', 'info', 'success', 'warning', 'danger', 'neutral'];

const CIRCULAR: ReadonlySet<ChartType> = new Set(['pie', 'doughnut', 'polarArea']);

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const v = styles.getPropertyValue(name).trim();
  return v || fallback;
}

/** Resolve a token / CSS-var name / raw color to a concrete color string. */
function resolveColor(color: ChartColorToken | string, styles: CSSStyleDeclaration): string {
  if (color in TOKEN_VARS) return readVar(styles, TOKEN_VARS[color as ChartColorToken], '#4a4a4a');
  if (color.startsWith('--')) return readVar(styles, color, '#4a4a4a');
  return color;
}

/** Add an alpha channel to a hex color; non-hex colors pass through unchanged. */
function withAlpha(color: string, alpha: number): string {
  const hex = color.trim();
  let r: number;
  let g: number;
  let b: number;
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (/^#[0-9a-f]{3}$/i.test(hex)) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    return color;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface Theme {
  text: string;
  secondaryText: string;
  grid: string;
  surface: string;
  tooltipBg: string;
  tooltipText: string;
  fontFamily: string;
}

function resolveTheme(styles: CSSStyleDeclaration): Theme {
  return {
    text: readVar(styles, '--text-color', '#1a1a1a'),
    secondaryText: readVar(styles, '--secondary-text-color', '#707070'),
    grid: withAlpha(readVar(styles, '--border-color', '#dcdcdc'), 0.6),
    surface: readVar(styles, '--bg-color', '#ffffff'),
    tooltipBg: readVar(styles, '--strong-text-color', '#1a1a1a'),
    tooltipText: readVar(styles, '--bg-color', '#ffffff'),
    fontFamily: readVar(styles, '--font-family', 'system-ui, sans-serif'),
  };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Recursively merge `source` over `target` (arrays/values replace, objects merge). */
function deepMerge<T>(target: T, source: unknown): T {
  if (!isPlainObject(source)) return (source === undefined ? target : source) as T;
  const base: Record<string, unknown> = isPlainObject(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    base[key] = isPlainObject(value) ? deepMerge(base[key], value) : value;
  }
  return base as T;
}

/**
 * True when a series should paint each data point a different palette color
 * (categorical bars, pie slices) rather than one color for the whole series.
 *
 * - Circular charts always multi-color by slice.
 * - Single-series bars multi-color by category unless `color` is set (then
 *   the whole series stays monochrome). Multi-series / stacked bars keep
 *   one color per series so segments stay distinguishable.
 */
function usesPerPointColors(
  type: ChartType,
  series: ChartSeries[],
  seriesItem: ChartSeries
): boolean {
  if (CIRCULAR.has(type)) return true;
  const renderedAsBar = type === 'bar' || seriesItem.type === 'bar';
  return renderedAsBar && series.length === 1 && seriesItem.color == null;
}

function buildData(
  type: ChartType,
  labels: Array<string | number> | undefined,
  series: ChartSeries[],
  palette: Array<ChartColorToken | string>,
  styles: CSSStyleDeclaration
): ChartData {
  const circular = CIRCULAR.has(type);
  const datasets = series.map((s, i) => {
    if (usesPerPointColors(type, series, s)) {
      const pointColors = s.data.map((_, di) => resolveColor(palette[di % palette.length], styles));
      if (circular) {
        return deepMerge<ChartDataset>(
          {
            label: s.label,
            data: s.data,
            backgroundColor: pointColors.map((c) => withAlpha(c, 0.85)),
            borderColor: readVar(styles, '--bg-color', '#ffffff'),
            borderWidth: 2,
          } as ChartDataset,
          s.dataset
        );
      }
      // Categorical single-series bar: one solid palette color per bar.
      return deepMerge<ChartDataset>(
        {
          ...(s.type ? { type: s.type } : {}),
          label: s.label,
          data: s.data,
          backgroundColor: pointColors,
          borderColor: pointColors,
          borderWidth: 0,
        } as ChartDataset,
        s.dataset
      );
    }

    const base = resolveColor(s.color ?? palette[i % palette.length], styles);
    const wantFill = s.fill ?? type === 'area';
    return deepMerge<ChartDataset>(
      {
        ...(s.type ? { type: s.type } : {}),
        label: s.label,
        data: s.data,
        borderColor: base,
        backgroundColor: wantFill ? withAlpha(base, 0.2) : base,
        fill: wantFill,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: type === 'scatter' || type === 'bubble' ? 4 : 2,
        pointHoverRadius: 5,
        pointBackgroundColor: base,
      } as ChartDataset,
      s.dataset
    );
  });

  return { labels, datasets };
}

function buildThemedOptions(theme: Theme, props: ChartProps): ChartOptions {
  const { type, legend, stacked, showGrid = true, height, aspectRatio = 2 } = props;
  const circular = CIRCULAR.has(type);
  const scatterLike = type === 'scatter' || type === 'bubble';
  const legendShown = legend === false ? false : legend == null ? !scatterLike : true;
  const legendPosition = typeof legend === 'string' ? legend : 'top';
  const fontFamily = theme.fontFamily;

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: height == null,
    aspectRatio,
    // Leave room so end-of-bar / above-point labels are not clipped.
    layout: { padding: { top: 12, right: 28, bottom: 4, left: 4 } },
    color: theme.text,
    font: { family: fontFamily },
    plugins: {
      legend: {
        display: legendShown,
        position: legendPosition,
        labels: {
          color: theme.text,
          font: { family: fontFamily },
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipText,
        bodyColor: theme.tooltipText,
        borderColor: theme.grid,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        usePointStyle: true,
        titleFont: { family: fontFamily },
        bodyFont: { family: fontFamily },
      },
    },
  };

  if (!circular) {
    const axis = {
      grid: { display: showGrid, color: theme.grid },
      border: { color: theme.grid },
      ticks: { color: theme.secondaryText, font: { family: fontFamily } },
      stacked,
    };
    options.scales = { x: { ...axis }, y: { ...axis } };
  } else if (type === 'polarArea') {
    options.scales = {
      r: {
        grid: { color: theme.grid },
        angleLines: { color: theme.grid },
        ticks: { color: theme.secondaryText, backdropColor: 'transparent' },
      },
    };
  }

  if (type === 'radar') {
    options.scales = {
      r: {
        grid: { color: theme.grid },
        angleLines: { color: theme.grid },
        pointLabels: { color: theme.text, font: { family: fontFamily } },
        ticks: { color: theme.secondaryText, backdropColor: 'transparent' },
      },
    };
  }

  return options;
}

// ── On-chart data labels ────────────────────────────────────────────────────

function formatDataValue(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return '';
    if (Number.isInteger(raw)) return String(raw);
    return raw.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (typeof raw === 'object') {
    const p = raw as Point & BubbleDataPoint & { y?: number; r?: number };
    if (typeof p.y === 'number') return formatDataValue(p.y);
  }
  return String(raw);
}

function isBarLikeElement(el: { x: number; y: number; base?: number; horizontal?: boolean }): boolean {
  return typeof el.base === 'number';
}

function isArcLikeElement(el: {
  startAngle?: number;
  endAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
}): boolean {
  return (
    typeof el.startAngle === 'number' &&
    typeof el.endAngle === 'number' &&
    typeof el.outerRadius === 'number'
  );
}

/** Axis-aligned box used for label collision. */
type LabelBox = { left: number; top: number; right: number; bottom: number };

function boxesOverlap(a: LabelBox, b: LabelBox, pad = 3): boolean {
  return !(
    a.right + pad < b.left ||
    a.left - pad > b.right ||
    a.bottom + pad < b.top ||
    a.top - pad > b.bottom
  );
}

function boxArea(b: LabelBox): number {
  return Math.max(0, b.right - b.left) * Math.max(0, b.bottom - b.top);
}

function clipBoxToArea(box: LabelBox, area: LabelBox): LabelBox {
  return {
    left: Math.max(box.left, area.left),
    top: Math.max(box.top, area.top),
    right: Math.min(box.right, area.right),
    bottom: Math.min(box.bottom, area.bottom),
  };
}

type PointLabelCandidate = {
  /** Anchor (data point) in canvas space. */
  px: number;
  py: number;
  /** Text lines to draw. */
  lines: string[];
  /** Line height in px. */
  lineHeight: number;
  /** Measured max line width. */
  textWidth: number;
  /** Point radius so leader lines start outside the marker. */
  pointRadius: number;
};

type PlacedPointLabel = PointLabelCandidate & {
  /** Text anchor (chart.js textAlign center → mid-x of box). */
  x: number;
  y: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  box: LabelBox;
  /** True when the label was moved off the default slot. */
  offset: boolean;
};

/**
 * Candidate offsets around a point (dx/dy from the marker to the text anchor).
 * Prefer above, then side, then below — rings grow outward when crowded.
 */
function pointLabelOffsets(radius: number): Array<{
  dx: number;
  dy: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
}> {
  const r = radius;
  const r2 = radius * 1.65;
  const r3 = radius * 2.4;
  return [
    { dx: 0, dy: -r, align: 'center', baseline: 'bottom' },
    { dx: r * 0.85, dy: -r * 0.75, align: 'left', baseline: 'bottom' },
    { dx: -r * 0.85, dy: -r * 0.75, align: 'right', baseline: 'bottom' },
    { dx: r, dy: 0, align: 'left', baseline: 'middle' },
    { dx: -r, dy: 0, align: 'right', baseline: 'middle' },
    { dx: r * 0.85, dy: r * 0.75, align: 'left', baseline: 'top' },
    { dx: -r * 0.85, dy: r * 0.75, align: 'right', baseline: 'top' },
    { dx: 0, dy: r, align: 'center', baseline: 'top' },
    // Wider ring
    { dx: 0, dy: -r2, align: 'center', baseline: 'bottom' },
    { dx: r2 * 0.9, dy: -r2 * 0.55, align: 'left', baseline: 'bottom' },
    { dx: -r2 * 0.9, dy: -r2 * 0.55, align: 'right', baseline: 'bottom' },
    { dx: r2, dy: r2 * 0.15, align: 'left', baseline: 'middle' },
    { dx: -r2, dy: r2 * 0.15, align: 'right', baseline: 'middle' },
    { dx: r2 * 0.9, dy: r2 * 0.55, align: 'left', baseline: 'top' },
    { dx: -r2 * 0.9, dy: r2 * 0.55, align: 'right', baseline: 'top' },
    { dx: 0, dy: r2, align: 'center', baseline: 'top' },
    // Outer ring for dense clusters
    { dx: 0, dy: -r3, align: 'center', baseline: 'bottom' },
    { dx: r3, dy: -r3 * 0.35, align: 'left', baseline: 'middle' },
    { dx: -r3, dy: -r3 * 0.35, align: 'right', baseline: 'middle' },
    { dx: r3, dy: r3 * 0.35, align: 'left', baseline: 'middle' },
    { dx: -r3, dy: r3 * 0.35, align: 'right', baseline: 'middle' },
    { dx: 0, dy: r3, align: 'center', baseline: 'top' },
  ];
}

function measureLabelBox(
  px: number,
  py: number,
  dx: number,
  dy: number,
  align: CanvasTextAlign,
  baseline: CanvasTextBaseline,
  textWidth: number,
  textHeight: number,
  padX = 3,
  padY = 2,
): { x: number; y: number; box: LabelBox } {
  const x = px + dx;
  const y = py + dy;
  let left = x;
  if (align === 'center') left = x - textWidth / 2;
  else if (align === 'right') left = x - textWidth;
  // 'left' → left = x

  let top = y;
  if (baseline === 'middle') top = y - textHeight / 2;
  else if (baseline === 'bottom') top = y - textHeight;
  // 'top' → top = y

  return {
    x,
    y,
    box: {
      left: left - padX,
      top: top - padY,
      right: left + textWidth + padX,
      bottom: top + textHeight + padY,
    },
  };
}

/**
 * Place point labels so their bounding boxes do not overlap. When a label
 * cannot sit in the default slot above the marker, it is moved to a free
 * candidate and a leader line is drawn from the point to the label.
 */
function placePointLabels(
  items: PointLabelCandidate[],
  area: LabelBox,
  chartWidth: number,
): PlacedPointLabel[] {
  const narrow = chartWidth < 480;
  const baseRadius = narrow ? 22 : 28;
  const placed: PlacedPointLabel[] = [];
  const placedBoxes: LabelBox[] = [];
  const offsets = pointLabelOffsets(baseRadius);

  // Place denser (higher) points first so top-of-chart labels settle cleanly.
  const order = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.py - b.item.py || a.item.px - b.item.px);

  for (const { item } of order) {
    const textHeight = item.lines.length * item.lineHeight;
    const defaultSlot = offsets[0];
    let best: PlacedPointLabel | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let oi = 0; oi < offsets.length; oi++) {
      const slot = offsets[oi];
      const measured = measureLabelBox(
        item.px,
        item.py,
        slot.dx,
        slot.dy,
        slot.align,
        slot.baseline,
        item.textWidth,
        textHeight,
      );

      // Soft-clamp into chart area (keep as much of the box visible as possible).
      let { x, y, box } = measured;
      const bw = box.right - box.left;
      const bh = box.bottom - box.top;
      if (box.left < area.left) {
        const shift = area.left - box.left;
        x += shift;
        box = { ...box, left: box.left + shift, right: box.right + shift };
      }
      if (box.right > area.right) {
        const shift = box.right - area.right;
        x -= shift;
        box = { ...box, left: box.left - shift, right: box.right - shift };
      }
      if (box.top < area.top) {
        const shift = area.top - box.top;
        y += shift;
        box = { ...box, top: box.top + shift, bottom: box.bottom + shift };
      }
      if (box.bottom > area.bottom) {
        const shift = box.bottom - area.bottom;
        y -= shift;
        box = { ...box, top: box.top - shift, bottom: box.bottom - shift };
      }

      // Reject if still mostly outside after clamp.
      const visible = clipBoxToArea(box, area);
      if (boxArea(visible) < bw * bh * 0.55) continue;

      let overlapCount = 0;
      let overlapArea = 0;
      for (const other of placedBoxes) {
        if (boxesOverlap(box, other)) {
          overlapCount += 1;
          const inter: LabelBox = {
            left: Math.max(box.left, other.left),
            top: Math.max(box.top, other.top),
            right: Math.min(box.right, other.right),
            bottom: Math.min(box.bottom, other.bottom),
          };
          overlapArea += boxArea(inter);
        }
      }

      // Prefer earlier slots (default above) and less travel from the point.
      const travel = Math.hypot(x - item.px, y - item.py);
      const score = overlapCount * 1e6 + overlapArea * 10 + oi * 40 + travel;

      if (score < bestScore) {
        bestScore = score;
        const offset =
          Math.hypot(slot.dx - defaultSlot.dx, slot.dy - defaultSlot.dy) > 4 ||
          Math.hypot(x - (item.px + defaultSlot.dx), y - (item.py + defaultSlot.dy)) > 10;
        best = {
          ...item,
          x,
          y,
          align: slot.align,
          baseline: slot.baseline,
          box,
          offset: offset || travel > item.pointRadius + 14,
        };
        if (overlapCount === 0) break; // first free slot wins
      }
    }

    if (!best) {
      // Fallback: default above, even if cramped.
      const slot = defaultSlot;
      const measured = measureLabelBox(
        item.px,
        item.py,
        slot.dx,
        slot.dy,
        slot.align,
        slot.baseline,
        item.textWidth,
        textHeight,
      );
      best = {
        ...item,
        x: measured.x,
        y: measured.y,
        align: slot.align,
        baseline: slot.baseline,
        box: measured.box,
        offset: false,
      };
    }

    placed.push(best);
    placedBoxes.push(best.box);
  }

  return placed;
}

/**
 * Built-in plugin: paints a numeric value (and a name where needed) on every
 * visible element (bars, slices, points). Theme-aware; skip with
 * `dataLabels={false}`.
 *
 * Text content:
 * - **Circular** (pie / doughnut / polarArea): category label + value
 *   (slices have no axis ticks, so the name is required).
 * - **Bar / line / radar**: value only (axes / legend identify marks).
 * - **Scatter / bubble**: series label (dataset name). Labels are collision-
 *   resolved with bounding-box checks; when a label must move, a leader line
 *   connects the data point to the free placement.
 */
function createDataLabelsPlugin(theme: Theme): Plugin {
  const lineHeight = 13;
  const fontSize = 11;

  return {
    id: 'gltDataLabels',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      const multiSeries = data.datasets.length > 1;
      const area = chart.chartArea;
      if (!area) return;

      const plotArea: LabelBox = {
        left: area.left + 2,
        top: area.top + 2,
        right: area.right - 2,
        bottom: area.bottom - 2,
      };

      ctx.save();
      ctx.font = `600 ${fontSize}px ${theme.fontFamily}`;
      ctx.textBaseline = 'middle';

      const pendingPoints: PointLabelCandidate[] = [];

      for (let di = 0; di < data.datasets.length; di++) {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) continue;
        const dataset = data.datasets[di];
        // chart.config may be ChartConfigurationCustomTypesPerDataset (no top-level type)
        const configType = String(
          (chart.config as { type?: string }).type ?? '',
        );
        const metaType = String(meta.type ?? configType);
        const isScatterLike = metaType === 'scatter' || metaType === 'bubble';

        for (let i = 0; i < meta.data.length; i++) {
          const el = meta.data[i] as {
            x: number;
            y: number;
            base?: number;
            horizontal?: boolean;
            startAngle?: number;
            endAngle?: number;
            innerRadius?: number;
            outerRadius?: number;
            skip?: boolean;
            options?: { radius?: number };
            getProps?: (props: string[], final?: boolean) => { radius?: number };
          };
          if (!el || el.skip) continue;

          const raw = Array.isArray(dataset.data) ? dataset.data[i] : undefined;
          if (raw == null || (typeof raw === 'number' && !Number.isFinite(raw))) continue;

          const valueText = formatDataValue(raw);
          if (!valueText && !isScatterLike) continue;

          const category =
            data.labels && data.labels[i] != null ? String(data.labels[i]) : undefined;
          const seriesName = dataset.label ? String(dataset.label) : undefined;
          const arc = isArcLikeElement(el);

          // ── Scatter / bubble: defer for collision resolution ────────────
          if (isScatterLike && !arc && !isBarLikeElement(el)) {
            const name = seriesName ?? category ?? valueText;
            if (!name) continue;
            const narrow = (chart.width ?? 400) < 480;
            const maxChars = narrow ? 16 : 22;
            const drawn =
              name.length > maxChars ? `${name.slice(0, maxChars - 1)}…` : name;
            const lines = [drawn];
            ctx.font = `600 ${fontSize}px ${theme.fontFamily}`;
            const textWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
            const pointRadius =
              el.getProps?.(['radius'], true)?.radius ??
              el.options?.radius ??
              (typeof (dataset as { pointRadius?: number }).pointRadius === 'number'
                ? (dataset as { pointRadius: number }).pointRadius
                : 4);
            pendingPoints.push({
              px: el.x,
              py: el.y,
              lines,
              lineHeight,
              textWidth,
              pointRadius: Number(pointRadius) || 4,
            });
            continue;
          }

          // Names only on arcs — cartesian axes / legends already identify marks.
          const nameText = arc ? (category ?? seriesName) : undefined;
          const lines = nameText ? [nameText, valueText] : [valueText];
          if (!lines[0]) continue;

          let x = el.x;
          let y = el.y;
          let align: CanvasTextAlign = 'center';
          let fillStyle = theme.text;
          let useStroke = false;

          if (arc) {
            const start = el.startAngle!;
            const end = el.endAngle!;
            // Skip tiny slices — label would overflow.
            if (end - start < 0.2) continue;
            const mid = (start + end) / 2;
            const inner = el.innerRadius ?? 0;
            const outer = el.outerRadius!;
            const r = inner + (outer - inner) * 0.62;
            // ArcElement.x/y is the chart center.
            x = el.x + Math.cos(mid) * r;
            y = el.y + Math.sin(mid) * r;
            align = 'center';
            fillStyle = '#ffffff';
            useStroke = true;
          } else if (isBarLikeElement(el)) {
            const horizontal = Boolean(el.horizontal);
            const base = el.base!;
            if (horizontal) {
              const goingRight = el.x >= base;
              const outsideX = el.x + (goingRight ? 8 : -8);
              const chartRight = chart.chartArea.right;
              const chartLeft = chart.chartArea.left;
              const fitsOutside = goingRight
                ? outsideX < chartRight + 20
                : outsideX > chartLeft - 20;
              if (fitsOutside) {
                x = outsideX;
                align = goingRight ? 'left' : 'right';
                fillStyle = theme.text;
                useStroke = false;
              } else {
                x = (el.x + base) / 2;
                align = 'center';
                fillStyle = '#ffffff';
                useStroke = true;
              }
              y = el.y;
            } else {
              const goingUp = el.y <= base;
              const outsideY = el.y + (goingUp ? -8 : 8);
              if (goingUp ? outsideY > chart.chartArea.top - 4 : outsideY < chart.chartArea.bottom + 4) {
                y = outsideY;
                fillStyle = theme.text;
                useStroke = false;
              } else {
                y = (el.y + base) / 2;
                fillStyle = '#ffffff';
                useStroke = true;
              }
              x = el.x;
              align = 'center';
            }
          } else {
            // Line / radar — sit just above the marker (no leader lines).
            x = el.x;
            y = el.y - 14;
            align = 'center';
            fillStyle = theme.text;
            useStroke = false;
          }

          const blockHeight = lines.length * lineHeight;
          let textY = y - blockHeight / 2 + lineHeight / 2;

          ctx.textAlign = align;
          ctx.fillStyle = fillStyle;
          if (useStroke) {
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
          }

          for (const line of lines) {
            const maxChars = arc ? 12 : multiSeries ? 16 : 18;
            const drawn = line.length > maxChars ? `${line.slice(0, maxChars - 1)}…` : line;
            if (useStroke) ctx.strokeText(drawn, x, textY);
            ctx.fillText(drawn, x, textY);
            textY += lineHeight;
          }
        }
      }

      // ── Scatter / bubble: resolve overlaps, draw leader lines, then text ─
      if (pendingPoints.length > 0) {
        const placed = placePointLabels(pendingPoints, plotArea, chart.width ?? 400);

        // Leader lines first (under text).
        for (const label of placed) {
          if (!label.offset) continue;
          const textHeight = label.lines.length * label.lineHeight;
          // Aim at the center of the label box.
          const lx = (label.box.left + label.box.right) / 2;
          const ly = (label.box.top + label.box.bottom) / 2;
          const dx = lx - label.px;
          const dy = ly - label.py;
          const dist = Math.hypot(dx, dy) || 1;
          // Start just outside the marker.
          const startR = label.pointRadius + 2;
          const sx = label.px + (dx / dist) * startR;
          const sy = label.py + (dy / dist) * startR;
          // End at the edge of the label box toward the point.
          const endPad = 2;
          let ex = lx;
          let ey = ly;
          const box = label.box;
          // Clamp end to the box boundary along the ray from point → label.
          if (Math.abs(dx) > Math.abs(dy)) {
            ex = dx > 0 ? box.left - endPad : box.right + endPad;
            ey = label.py + (dy / dist) * Math.abs(ex - label.px);
            ey = Math.min(box.bottom - 2, Math.max(box.top + 2, ey));
          } else {
            ey = dy > 0 ? box.top - endPad : box.bottom + endPad;
            ex = label.px + (dx / dist) * Math.abs(ey - label.py);
            ex = Math.min(box.right - 2, Math.max(box.left + 2, ex));
          }

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = theme.secondaryText;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Small cap at the label end.
          ctx.beginPath();
          ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = theme.secondaryText;
          ctx.globalAlpha = 0.55;
          ctx.fill();
          ctx.globalAlpha = 1;

          void textHeight;
        }

        // Text on top.
        ctx.font = `600 ${fontSize}px ${theme.fontFamily}`;
        ctx.fillStyle = theme.text;
        for (const label of placed) {
          ctx.textAlign = label.align;
          ctx.textBaseline = label.baseline;
          let textY = label.y;
          // When baseline is middle/bottom/top, draw multi-line relative to anchor.
          if (label.lines.length > 1) {
            const block = label.lines.length * label.lineHeight;
            if (label.baseline === 'middle') textY = label.y - block / 2 + label.lineHeight / 2;
            else if (label.baseline === 'bottom') textY = label.y - block + label.lineHeight / 2;
            else textY = label.y + label.lineHeight / 2;
            ctx.textBaseline = 'middle';
            for (const line of label.lines) {
              ctx.fillText(line, label.x, textY);
              textY += label.lineHeight;
            }
          } else {
            ctx.fillText(label.lines[0] ?? '', label.x, label.y);
          }
        }
      }

      ctx.restore();
    },
  };
}

/**
 * A themed wrapper around chart.js. Feed it `labels` + `series` for the common
 * case — colors, fonts, grid, tooltip, and legend are pulled from the design
 * system's theme tokens and re-read automatically on light/dark switches.
 *
 * Default colouring:
 * - **Pie / doughnut / polarArea** — each slice from the palette by index
 * - **Single-series bar** — each bar from the palette by category (set
 *   `series[].color` for monochrome)
 * - **Multi-series / stacked bar or area** — one palette color per series
 *
 * On-chart annotations are drawn by default (`dataLabels={false}` to hide):
 * **category + value** on circular charts, **value only** on bar/line charts,
 * and **series labels with leader lines** on scatter/bubble charts when labels
 * would otherwise overlap. Long category names can wrap via
 * `categoryLabelMaxChars` (multi-line ticks). Drop down to raw chart.js via
 * `data`, `options`, and `plugins`.
 */
export function Chart({
  type,
  labels,
  series,
  data,
  options,
  palette,
  legend,
  title,
  caption,
  stacked,
  showGrid,
  height,
  aspectRatio,
  ariaLabel,
  dataLabels = true,
  categoryLabelMaxChars,
  plugins,
  className,
  ...rest
}: ChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartRef = React.useRef<ChartJS | null>(null);
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const [themeTick, setThemeTick] = React.useState(0);
  const [frameWidth, setFrameWidth] = React.useState(0);

  // Re-read theme tokens whenever the active theme changes.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const observer = new MutationObserver(() => setThemeTick((t) => t + 1));
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMedia = () => setThemeTick((t) => t + 1);
    media.addEventListener('change', onMedia);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', onMedia);
    };
  }, []);

  // Track panel width so category label wrapping can tighten on mobile.
  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setFrameWidth((prev) => (Math.abs(prev - w) < 1 ? prev : w));
    });
    ro.observe(frame);
    setFrameWidth(frame.clientWidth);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(canvas);
    const theme = resolveTheme(styles);
    const resolvedPalette = palette ?? DEFAULT_PALETTE;
    let chartData = data ?? buildData(type, labels, series ?? [], resolvedPalette, styles);
    const themedOptions = buildThemedOptions(theme, {
      type,
      legend,
      stacked,
      showGrid,
      height,
      aspectRatio,
    } as ChartProps);
    const finalOptions = deepMerge<ChartOptions>(themedOptions, options);
    const indexAxis =
      (finalOptions as { indexAxis?: 'x' | 'y' }).indexAxis === 'y' ? 'y' : 'x';

    // Multi-line ticks are a cartesian-axis concern; circular charts label on slices.
    // Clamp the caller's max to the real panel width so narrow viewports wrap
    // (and stop clipping) without shrinking the tick font size.
    if (
      categoryLabelMaxChars != null &&
      categoryLabelMaxChars > 0 &&
      !CIRCULAR.has(type)
    ) {
      const effectiveMax = resolveCategoryLabelMaxChars(
        categoryLabelMaxChars,
        frameWidth || frameRef.current?.clientWidth || 0,
        indexAxis,
      );
      chartData = withWrappedCategoryLabels(chartData, effectiveMax);
      finalOptions.scales = finalOptions.scales ?? {};
      const scale = (finalOptions.scales[indexAxis] ?? {}) as Record<string, unknown>;
      const ticks = (scale.ticks ?? {}) as Record<string, unknown>;
      const prevAfterFit = scale.afterFit as ((s: { width: number }) => void) | undefined;
      // Longest wrapped line ≈ effectiveMax chars; reserve that many CSS px on the axis
      // so Chart.js does not draw past the left canvas edge on small screens.
      const minAxisPx = Math.ceil(effectiveMax * CATEGORY_LABEL_CHAR_PX) + 12;
      finalOptions.scales[indexAxis] = {
        ...scale,
        ticks: {
          ...ticks,
          autoSkip: ticks.autoSkip ?? false,
        },
        afterFit(axis: { width: number }) {
          prevAfterFit?.(axis);
          axis.width = Math.max(axis.width, minAxisPx);
        },
      } as (typeof finalOptions.scales)[typeof indexAxis];
    }

    const jsType: ChartJsType = (type === 'area' ? 'line' : type) as ChartJsType;
    const resolvedPlugins: Plugin[] = [
      ...(dataLabels ? [createDataLabelsPlugin(theme)] : []),
      ...(plugins ?? []),
    ];

    const chart = new ChartJS(canvas, {
      type: jsType,
      data: chartData,
      options: finalOptions,
      plugins: resolvedPlugins,
    });
    chartRef.current = chart;

    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [
    type,
    labels,
    series,
    data,
    options,
    palette,
    legend,
    stacked,
    showGrid,
    height,
    aspectRatio,
    dataLabels,
    categoryLabelMaxChars,
    plugins,
    themeTick,
    frameWidth,
  ]);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...rest}>
      {title != null && (
        <Text as="div" size="lg" weight="semibold" tone="strong">
          {title}
        </Text>
      )}
      <div
        ref={frameRef}
        className="relative w-full min-w-0"
        style={height != null ? { height } : undefined}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
        />
      </div>
      {caption != null && (
        <Text as="div" size="sm" tone="secondary">
          {caption}
        </Text>
      )}
    </div>
  );
}

export default Chart;
