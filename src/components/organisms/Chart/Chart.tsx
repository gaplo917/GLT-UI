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

type Rgba = { r: number; g: number; b: number; a: number };

/** Parse hex / rgb(a) / hsl(a) into channels. Returns null for gradients/unknown. */
function parseCssColor(color: string): Rgba | null {
  const c = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(c)) {
    return {
      r: parseInt(c.slice(1, 3), 16),
      g: parseInt(c.slice(3, 5), 16),
      b: parseInt(c.slice(5, 7), 16),
      a: 1,
    };
  }
  if (/^#[0-9a-f]{3}$/i.test(c)) {
    return {
      r: parseInt(c[1] + c[1], 16),
      g: parseInt(c[2] + c[2], 16),
      b: parseInt(c[3] + c[3], 16),
      a: 1,
    };
  }
  if (/^#[0-9a-f]{8}$/i.test(c)) {
    return {
      r: parseInt(c.slice(1, 3), 16),
      g: parseInt(c.slice(3, 5), 16),
      b: parseInt(c.slice(5, 7), 16),
      a: parseInt(c.slice(7, 9), 16) / 255,
    };
  }
  const rgb = c.match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i,
  );
  if (rgb) {
    const aRaw = rgb[4];
    let a = 1;
    if (aRaw != null) {
      a = aRaw.endsWith('%') ? parseFloat(aRaw) / 100 : parseFloat(aRaw);
    }
    return {
      r: Math.min(255, parseFloat(rgb[1])),
      g: Math.min(255, parseFloat(rgb[2])),
      b: Math.min(255, parseFloat(rgb[3])),
      a: Number.isFinite(a) ? a : 1,
    };
  }
  return null;
}

function formatRgba({ r, g, b, a }: Rgba): string {
  const R = Math.round(Math.min(255, Math.max(0, r)));
  const G = Math.round(Math.min(255, Math.max(0, g)));
  const B = Math.round(Math.min(255, Math.max(0, b)));
  if (a >= 0.999) return `rgb(${R}, ${G}, ${B})`;
  return `rgba(${R}, ${G}, ${B}, ${Math.round(a * 1000) / 1000})`;
}

/** Relative luminance (sRGB, WCAG). */
function relativeLuminance({ r, g, b }: Rgba): number {
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(a: Rgba, b: Rgba): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixToward(from: Rgba, to: Rgba, t: number): Rgba {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  };
}

/**
 * Nudge a series color so it stays readable on the chart surface (light or dark).
 * Dark surfaces get brighter series colors; light surfaces get deeper ones when needed.
 * CSS variables should already be theme tokens — this mainly fixes raw hex palettes.
 */
function adaptColorForSurface(
  color: string,
  surface: string,
  minRatio = 3.0,
): string {
  const fg = parseCssColor(color);
  const bg = parseCssColor(surface);
  if (!fg || !bg) return color;

  const surfaceDark = relativeLuminance(bg) < 0.45;
  const target = surfaceDark
    ? { r: 255, g: 255, b: 255, a: fg.a }
    : { r: 0, g: 0, b: 0, a: fg.a };

  let best = fg;
  if (contrastRatio(fg, bg) >= minRatio) {
    // Still slightly lift very dark colors on dark surfaces (and dim near-white on light)
    // so multi-series stays distinct without becoming pure white/black.
    if (surfaceDark && relativeLuminance(fg) < 0.22) {
      best = mixToward(fg, target, 0.35);
    } else if (!surfaceDark && relativeLuminance(fg) > 0.82) {
      best = mixToward(fg, target, 0.28);
    }
    return formatRgba(best);
  }

  // Binary-search mix toward white/black until contrast is acceptable.
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const candidate = mixToward(fg, target, mid);
    if (contrastRatio(candidate, bg) >= minRatio) {
      best = candidate;
      hi = mid;
    } else {
      lo = mid;
    }
  }
  // Cap mix so brand hues are not washed out completely.
  const maxMix = surfaceDark ? 0.72 : 0.65;
  const usedT = Math.min(hi, maxMix);
  return formatRgba(mixToward(fg, target, usedT));
}

/** Add an alpha channel; hex / rgb(a) supported, others pass through. */
function withAlpha(color: string, alpha: number): string {
  const parsed = parseCssColor(color);
  if (!parsed) return color;
  return formatRgba({ ...parsed, a: alpha });
}

/** Force fully opaque paint (labels must not inherit marker translucency). */
function solidColor(color: string, fallback: string): string {
  const parsed = parseCssColor(color);
  if (!parsed) return fallback;
  return formatRgba({ ...parsed, a: 1 });
}

interface Theme {
  text: string;
  secondaryText: string;
  grid: string;
  surface: string;
  tooltipBg: string;
  tooltipText: string;
  fontFamily: string;
  /** True when chart surface is dark (for color adaptation). */
  isDark: boolean;
}

function resolveTheme(styles: CSSStyleDeclaration): Theme {
  const surface = readVar(styles, '--bg-color', '#ffffff');
  const surfaceParsed = parseCssColor(surface);
  const isDark = surfaceParsed ? relativeLuminance(surfaceParsed) < 0.45 : false;
  return {
    text: readVar(styles, '--text-color', '#1a1a1a'),
    secondaryText: readVar(styles, '--secondary-text-color', '#707070'),
    // Axis grid: quiet guide lines (15% of border token).
    grid: withAlpha(readVar(styles, '--border-color', '#dcdcdc'), 0.15),
    surface,
    tooltipBg: readVar(styles, '--strong-text-color', '#1a1a1a'),
    tooltipText: readVar(styles, '--bg-color', '#ffffff'),
    fontFamily: readVar(styles, '--font-family', 'system-ui, sans-serif'),
    isDark,
  };
}

/**
 * Resolve a palette token / CSS var / raw color, then adapt for the active
 * surface so charts stay legible in light and dark themes.
 */
function resolveChartColor(
  color: ChartColorToken | string,
  styles: CSSStyleDeclaration,
  theme: Theme,
): string {
  const resolved = resolveColor(color, styles);
  return adaptColorForSurface(resolved, theme.surface);
}

/** Walk chart.js dataset color fields and adapt string colors for the surface. */
function adaptDatasetColors<T extends ChartDataset>(dataset: T, theme: Theme): T {
  const keys = [
    'backgroundColor',
    'borderColor',
    'pointBackgroundColor',
    'pointBorderColor',
    'hoverBackgroundColor',
    'hoverBorderColor',
  ] as const;

  const src = dataset as unknown as Record<string, unknown>;
  const next: Record<string, unknown> = { ...src };
  for (const key of keys) {
    const value = src[key];
    if (typeof value === 'string') {
      next[key] = adaptColorForSurface(value, theme.surface);
    } else if (Array.isArray(value)) {
      next[key] = value.map((entry) =>
        typeof entry === 'string' ? adaptColorForSurface(entry, theme.surface) : entry,
      );
    }
  }
  return next as T;
}

function adaptChartDataColors(data: ChartData, theme: Theme): ChartData {
  if (!data.datasets?.length) return data;
  return {
    ...data,
    datasets: data.datasets.map((ds) => adaptDatasetColors(ds, theme)),
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
  styles: CSSStyleDeclaration,
  theme: Theme,
): ChartData {
  const circular = CIRCULAR.has(type);
  const datasets = series.map((s, i) => {
    if (usesPerPointColors(type, series, s)) {
      const pointColors = s.data.map((_, di) =>
        resolveChartColor(palette[di % palette.length], styles, theme),
      );
      if (circular) {
        return deepMerge<ChartDataset>(
          {
            label: s.label,
            data: s.data,
            backgroundColor: pointColors.map((c) => withAlpha(c, 0.85)),
            // Slice ring matches the active surface (light or dark card).
            borderColor: theme.surface,
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

    const base = resolveChartColor(s.color ?? palette[i % palette.length], styles, theme);
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

type PointLabelLine = {
  text: string;
  /** Canvas font-weight (e.g. 600 primary, 400 secondary / effort). */
  weight: number;
  /** Font size in CSS px. */
  size: number;
  /** Line box height for layout. */
  height: number;
};

type PointLabelCandidate = {
  /** Anchor (data point) in canvas space. */
  px: number;
  py: number;
  /** Text lines to draw (line 0 = title, line 1+ = effort / meta, thinner). */
  lines: PointLabelLine[];
  /** Total block height in px. */
  blockHeight: number;
  /** Measured max line width. */
  textWidth: number;
  /** Point radius so leader lines start outside the marker. */
  pointRadius: number;
  /** Marker color — label text + leader line match this. */
  color: string;
  /**
   * Preferred offset family: `above` (default) or `side` (keep labels off a
   * trend line that runs through the point cloud).
   */
  prefer?: 'above' | 'side';
};

/** Canvas-space polyline segment (e.g. a trend line under scatter labels). */
type LineSegment = { x1: number; y1: number; x2: number; y2: number };

function segmentsIntersect(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
): boolean {
  const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/** True if the leader ray from point → label crosses any trend segment. */
function leaderCrossesSegments(
  px: number,
  py: number,
  lx: number,
  ly: number,
  segments: LineSegment[],
): boolean {
  // Shorten slightly so endpoints on the polyline do not always count as hits.
  const dx = lx - px;
  const dy = ly - py;
  const dist = Math.hypot(dx, dy) || 1;
  const inset = Math.min(6, dist * 0.2);
  const sx = px + (dx / dist) * inset;
  const sy = py + (dy / dist) * inset;
  const ex = lx - (dx / dist) * inset;
  const ey = ly - (dy / dist) * inset;
  for (const s of segments) {
    if (segmentsIntersect(sx, sy, ex, ey, s.x1, s.y1, s.x2, s.y2)) return true;
  }
  return false;
}

/** Distance from point to segment AB. */
function distPointToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const len2 = vx * vx + vy * vy || 1;
  let t = ((px - x1) * vx + (py - y1) * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * vx), py - (y1 + t * vy));
}

/** True if label box overlaps a fattened segment (trend or leader under the text). */
function boxHitsSegments(box: LabelBox, segments: LineSegment[], pad = 5): boolean {
  const samples = [
    { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 },
    { x: box.left, y: box.top },
    { x: box.right, y: box.top },
    { x: box.left, y: box.bottom },
    { x: box.right, y: box.bottom },
    { x: (box.left + box.right) / 2, y: box.top },
    { x: (box.left + box.right) / 2, y: box.bottom },
    { x: box.left, y: (box.top + box.bottom) / 2 },
    { x: box.right, y: (box.top + box.bottom) / 2 },
  ];
  const threshold = pad + 3;
  for (const s of segments) {
    const minX = Math.min(s.x1, s.x2) - threshold;
    const maxX = Math.max(s.x1, s.x2) + threshold;
    const minY = Math.min(s.y1, s.y2) - threshold;
    const maxY = Math.max(s.y1, s.y2) + threshold;
    if (box.right < minX || box.left > maxX || box.bottom < minY || box.top > maxY) {
      continue;
    }
    for (const p of samples) {
      if (distPointToSegment(p.x, p.y, s.x1, s.y1, s.x2, s.y2) < threshold) return true;
    }
  }
  return false;
}

/**
 * Leader from data point to the **outside** of the label box (never through glyphs).
 * Returns null when the label sits flush on the marker (no leader needed).
 */
function leaderGeometry(
  px: number,
  py: number,
  box: LabelBox,
  pointRadius: number,
  gap = 4,
): { sx: number; sy: number; ex: number; ey: number; segment: LineSegment } | null {
  const cx = (box.left + box.right) / 2;
  const cy = (box.top + box.bottom) / 2;
  const dx = cx - px;
  const dy = cy - py;
  const dist = Math.hypot(dx, dy) || 1;
  if (dist < pointRadius + gap + 2) return null;

  const ux = dx / dist;
  const uy = dy / dist;
  const sx = px + ux * (pointRadius + 2);
  const sy = py + uy * (pointRadius + 2);

  // Inflate box by `gap` so the stroke ends clear of the text ink.
  const L = box.left - gap;
  const R = box.right + gap;
  const T = box.top - gap;
  const B = box.bottom + gap;

  // Ray px,py → cx,cy: first hit on inflated box boundary (from outside).
  let tHit = Number.POSITIVE_INFINITY;
  const candidates: number[] = [];
  if (Math.abs(ux) > 1e-9) {
    candidates.push((L - px) / ux, (R - px) / ux);
  }
  if (Math.abs(uy) > 1e-9) {
    candidates.push((T - py) / uy, (B - py) / uy);
  }
  for (const t of candidates) {
    if (t <= 0 || t >= dist || t >= tHit) continue;
    const x = px + ux * t;
    const y = py + uy * t;
    const onEdge =
      (Math.abs(x - L) < 0.6 || Math.abs(x - R) < 0.6) && y >= T - 0.6 && y <= B + 0.6;
    const onTopBot =
      (Math.abs(y - T) < 0.6 || Math.abs(y - B) < 0.6) && x >= L - 0.6 && x <= R + 0.6;
    if (onEdge || onTopBot) tHit = t;
  }

  let ex: number;
  let ey: number;
  if (Number.isFinite(tHit) && tHit < dist) {
    ex = px + ux * tHit;
    ey = py + uy * tHit;
  } else {
    // Fallback: nearest side of the inflated box to the point.
    if (Math.abs(dx) >= Math.abs(dy)) {
      ex = dx > 0 ? L : R;
      ey = Math.min(B, Math.max(T, py + uy * Math.abs(ex - px)));
    } else {
      ey = dy > 0 ? T : B;
      ex = Math.min(R, Math.max(L, px + ux * Math.abs(ey - py)));
    }
  }

  return {
    sx,
    sy,
    ex,
    ey,
    segment: { x1: sx, y1: sy, x2: ex, y2: ey },
  };
}

/** True if segment runs through any label box (pad clears text). */
function segmentHitsBoxes(
  seg: LineSegment,
  boxes: LabelBox[],
  pad = 3,
): boolean {
  for (const box of boxes) {
    const L = box.left - pad;
    const R = box.right + pad;
    const T = box.top - pad;
    const B = box.bottom + pad;
    // Quick reject
    if (
      Math.max(seg.x1, seg.x2) < L ||
      Math.min(seg.x1, seg.x2) > R ||
      Math.max(seg.y1, seg.y2) < T ||
      Math.min(seg.y1, seg.y2) > B
    ) {
      continue;
    }
    // Sample along segment
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = seg.x1 + (seg.x2 - seg.x1) * t;
      const y = seg.y1 + (seg.y2 - seg.y1) * t;
      if (x >= L && x <= R && y >= T && y <= B) return true;
    }
  }
  return false;
}

/** Resolve a chart.js color option (string | string[] | …) for one index. */
function resolveDatasetColor(
  value: unknown,
  index: number,
  fallback: string,
): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value) && value[index] != null) {
    const entry = value[index];
    if (typeof entry === 'string' && entry.trim()) return entry;
  }
  return fallback;
}

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
 * When `prefer === 'side'`, horizontal slots come first so leaders stay off a
 * trend line that runs above the marker.
 */
function pointLabelOffsets(
  radius: number,
  prefer: 'above' | 'side' = 'above',
): Array<{
  dx: number;
  dy: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
}> {
  const r = radius;
  const r2 = radius * 1.65;
  const r3 = radius * 2.4;
  const aboveFirst = [
    { dx: 0, dy: -r, align: 'center' as const, baseline: 'bottom' as const },
    { dx: r * 0.85, dy: -r * 0.75, align: 'left' as const, baseline: 'bottom' as const },
    { dx: -r * 0.85, dy: -r * 0.75, align: 'right' as const, baseline: 'bottom' as const },
    { dx: r, dy: 0, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r, dy: 0, align: 'right' as const, baseline: 'middle' as const },
    { dx: r * 0.85, dy: r * 0.75, align: 'left' as const, baseline: 'top' as const },
    { dx: -r * 0.85, dy: r * 0.75, align: 'right' as const, baseline: 'top' as const },
    { dx: 0, dy: r, align: 'center' as const, baseline: 'top' as const },
    { dx: 0, dy: -r2, align: 'center' as const, baseline: 'bottom' as const },
    { dx: r2 * 0.9, dy: -r2 * 0.55, align: 'left' as const, baseline: 'bottom' as const },
    { dx: -r2 * 0.9, dy: -r2 * 0.55, align: 'right' as const, baseline: 'bottom' as const },
    { dx: r2, dy: r2 * 0.15, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r2, dy: r2 * 0.15, align: 'right' as const, baseline: 'middle' as const },
    { dx: r2 * 0.9, dy: r2 * 0.55, align: 'left' as const, baseline: 'top' as const },
    { dx: -r2 * 0.9, dy: r2 * 0.55, align: 'right' as const, baseline: 'top' as const },
    { dx: 0, dy: r2, align: 'center' as const, baseline: 'top' as const },
    { dx: 0, dy: -r3, align: 'center' as const, baseline: 'bottom' as const },
    { dx: r3, dy: -r3 * 0.35, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r3, dy: -r3 * 0.35, align: 'right' as const, baseline: 'middle' as const },
    { dx: r3, dy: r3 * 0.35, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r3, dy: r3 * 0.35, align: 'right' as const, baseline: 'middle' as const },
    { dx: 0, dy: r3, align: 'center' as const, baseline: 'top' as const },
  ];
  if (prefer !== 'side') return aboveFirst;
  // Side-first: keep leaders horizontal / below so they do not cut a trend path.
  return [
    { dx: r, dy: 0, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r, dy: 0, align: 'right' as const, baseline: 'middle' as const },
    { dx: r * 0.9, dy: r * 0.55, align: 'left' as const, baseline: 'top' as const },
    { dx: -r * 0.9, dy: r * 0.55, align: 'right' as const, baseline: 'top' as const },
    { dx: 0, dy: r, align: 'center' as const, baseline: 'top' as const },
    { dx: r2, dy: r2 * 0.1, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r2, dy: r2 * 0.1, align: 'right' as const, baseline: 'middle' as const },
    { dx: r2 * 0.85, dy: r2 * 0.55, align: 'left' as const, baseline: 'top' as const },
    { dx: -r2 * 0.85, dy: r2 * 0.55, align: 'right' as const, baseline: 'top' as const },
    { dx: 0, dy: r2, align: 'center' as const, baseline: 'top' as const },
    { dx: r3, dy: r3 * 0.2, align: 'left' as const, baseline: 'middle' as const },
    { dx: -r3, dy: r3 * 0.2, align: 'right' as const, baseline: 'middle' as const },
    { dx: 0, dy: r3, align: 'center' as const, baseline: 'top' as const },
    // Above only as last resort (may still cross a trend line — scored heavily)
    { dx: 0, dy: -r, align: 'center' as const, baseline: 'bottom' as const },
    { dx: r * 0.85, dy: -r * 0.75, align: 'left' as const, baseline: 'bottom' as const },
    { dx: -r * 0.85, dy: -r * 0.75, align: 'right' as const, baseline: 'bottom' as const },
    { dx: 0, dy: -r2, align: 'center' as const, baseline: 'bottom' as const },
    { dx: r2 * 0.9, dy: -r2 * 0.55, align: 'left' as const, baseline: 'bottom' as const },
    { dx: -r2 * 0.9, dy: -r2 * 0.55, align: 'right' as const, baseline: 'bottom' as const },
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

/** Square hit-box around a scatter marker (circle approximated as AABB). */
function dataPointBox(px: number, py: number, pointRadius: number, pad = 4): LabelBox {
  const r = Math.max(pointRadius, 3) + pad;
  return {
    left: px - r,
    top: py - r,
    right: px + r,
    bottom: py + r,
  };
}

function accumulateOverlap(
  box: LabelBox,
  obstacles: LabelBox[],
): { count: number; area: number } {
  let count = 0;
  let area = 0;
  for (const other of obstacles) {
    if (boxesOverlap(box, other)) {
      count += 1;
      const inter: LabelBox = {
        left: Math.max(box.left, other.left),
        top: Math.max(box.top, other.top),
        right: Math.min(box.right, other.right),
        bottom: Math.min(box.bottom, other.bottom),
      };
      area += boxArea(inter);
    }
  }
  return { count, area };
}

/**
 * Place point labels so their bounding boxes do not overlap each other,
 * data-point markers, **or leader lines** (own attach path and others).
 * Optional `lineSegments` also keep labels/leaders off a chart trend path.
 */
function placePointLabels(
  items: PointLabelCandidate[],
  area: LabelBox,
  chartWidth: number,
  lineSegments: LineSegment[] = [],
): PlacedPointLabel[] {
  const narrow = chartWidth < 480;
  // Slightly larger default radius → more gap between marker and text/leaders.
  const baseRadius = narrow ? 26 : 32;
  const placed: PlacedPointLabel[] = [];
  const placedLabelBoxes: LabelBox[] = [];
  /** Leader strokes already committed — later labels must clear them. */
  const placedLeaders: LineSegment[] = [];

  // Every scatter marker is an obstacle — labels must not cover data points
  // (including a label's own marker when the text would sit on top of it).
  const pointBoxes: LabelBox[] = items.map((it) =>
    dataPointBox(it.px, it.py, it.pointRadius),
  );

  // Place denser (higher) points first so top-of-chart labels settle cleanly.
  const order = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.py - b.item.py || a.item.px - b.item.px);

  for (const { item, index: itemIndex } of order) {
    const textHeight = item.blockHeight;
    const prefer = item.prefer ?? 'above';
    const offsets = pointLabelOffsets(baseRadius, prefer);
    const defaultSlot = offsets[0]!;
    let best: PlacedPointLabel | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    let bestLeader: LineSegment | null = null;

    // Other markers only (own marker handled with a lighter penalty so default
    // "above" placement can still win when the box clears the disc).
    const otherPointBoxes = pointBoxes.filter((_, i) => i !== itemIndex);
    const ownPointBox = pointBoxes[itemIndex]!;
    const obstacleLines = [...lineSegments, ...placedLeaders];

    for (let oi = 0; oi < offsets.length; oi++) {
      const slot = offsets[oi]!;
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

      // Obstacles: already-placed labels + all other data points + own marker.
      const labelHit = accumulateOverlap(box, placedLabelBoxes);
      const otherPointHit = accumulateOverlap(box, otherPointBoxes);
      const ownPointHit = accumulateOverlap(box, [ownPointBox]);

      // Hard-prefer no label-on-label or label-on-foreign-point collisions.
      const hardCount = labelHit.count + otherPointHit.count;
      const hardArea = labelHit.area + otherPointHit.area;
      // Covering the home marker is discouraged but allowed if nothing else fits.
      const softCount = ownPointHit.count;
      const softArea = ownPointHit.area;

      const travel = Math.hypot(x - item.px, y - item.py);
      const needsLeader = travel > item.pointRadius + 14;
      const geom = needsLeader
        ? leaderGeometry(item.px, item.py, box, item.pointRadius, 5)
        : null;

      // Text must not sit on a trend path or an existing leader stroke.
      const boxOnStroke = boxHitsSegments(box, obstacleLines, 6);
      // Own leader must not cross trend paths, other leaders, or other labels.
      let leaderConflict = 0;
      if (geom) {
        if (leaderCrossesSegments(geom.sx, geom.sy, geom.ex, geom.ey, obstacleLines)) {
          leaderConflict += 1;
        }
        // Leader must not cut through *other* labels (own box is the attach target).
        if (segmentHitsBoxes(geom.segment, placedLabelBoxes, 4)) {
          leaderConflict += 1;
        }
      }

      // Prefer earlier slots and less travel from the point.
      // Crossing a stroke or burying text on a leader is nearly as bad as
      // covering another label (Fig 4 dense scatter).
      const score =
        hardCount * 1e7 +
        hardArea * 100 +
        (boxOnStroke ? 6e6 : 0) +
        leaderConflict * 5e6 +
        softCount * 1e5 +
        softArea * 20 +
        oi * 40 +
        travel;

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
          offset: offset || needsLeader,
        };
        bestLeader = geom?.segment ?? null;
        // First slot free of labels, points, and stroke conflicts.
        if (
          hardCount === 0 &&
          softCount === 0 &&
          !boxOnStroke &&
          leaderConflict === 0
        ) {
          break;
        }
      }
    }

    if (!best) {
      // Fallback: default preferred slot, even if cramped.
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
      bestLeader = null;
    }

    placed.push(best);
    placedLabelBoxes.push(best.box);
    if (best.offset && bestLeader) {
      placedLeaders.push(bestLeader);
    } else if (best.offset) {
      const g = leaderGeometry(best.px, best.py, best.box, best.pointRadius, 5);
      if (g) placedLeaders.push(g.segment);
    }
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
 *   resolved against other labels, data-point markers, **and leader strokes**
 *   (text must not sit on a leader); when a label must move, a leader attaches
 *   to the outside of the text box, not through the glyphs.
 */
function createDataLabelsPlugin(theme: Theme): Plugin {
  const lineHeight = 13;
  const fontSize = 11;
  /** Primary scatter title line. */
  const titleSize = 11;
  const titleWeight = 600;
  const titleLineHeight = 13;
  /** Secondary line (thinking effort / meta) — thinner, slightly smaller. */
  const metaSize = 10;
  const metaWeight = 400;
  const metaLineHeight = 12;

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
        // Per-dataset opt-out (e.g. trend line under labeled scatter points).
        const dsLabels = (dataset as { datalabels?: boolean | { display?: boolean } })
          .datalabels;
        if (
          dsLabels === false ||
          (typeof dsLabels === 'object' && dsLabels?.display === false)
        ) {
          continue;
        }
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
            // Multi-line labels: "Title\neffort" — first line semibold, rest thinner.
            const rawLines = name
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
            const lines: PointLabelLine[] = rawLines.map((line, li) => {
              const isMeta = li > 0;
              const size = isMeta ? metaSize : titleSize;
              const weight = isMeta ? metaWeight : titleWeight;
              const height = isMeta ? metaLineHeight : titleLineHeight;
              const max = isMeta ? Math.min(maxChars, 14) : maxChars;
              const text = line.length > max ? `${line.slice(0, max - 1)}…` : line;
              return { text, weight, size, height };
            });
            if (lines.length === 0) continue;

            let textWidth = 0;
            let blockHeight = 0;
            for (const line of lines) {
              ctx.font = `${line.weight} ${line.size}px ${theme.fontFamily}`;
              textWidth = Math.max(textWidth, ctx.measureText(line.text).width);
              blockHeight += line.height;
            }

            const pointRadius =
              el.getProps?.(['radius'], true)?.radius ??
              el.options?.radius ??
              (typeof (dataset as { pointRadius?: number }).pointRadius === 'number'
                ? (dataset as { pointRadius: number }).pointRadius
                : 4);
            // Prefer the painted marker color (bg → border → theme text).
            const ds = dataset as {
              backgroundColor?: unknown;
              borderColor?: unknown;
              pointBackgroundColor?: unknown;
              pointBorderColor?: unknown;
            };
            // Dataset colors are already surface-adapted at chart create time;
            // re-adapt here so custom plugins / live updates stay theme-safe.
            const rawColor = resolveDatasetColor(
              ds.pointBackgroundColor ?? ds.backgroundColor,
              i,
              resolveDatasetColor(
                ds.pointBorderColor ?? ds.borderColor,
                i,
                theme.text,
              ),
            );
            // Labels stay 100% opaque even when markers use translucent fills.
            const color = solidColor(
              adaptColorForSurface(rawColor, theme.surface),
              theme.text,
            );
            const preferRaw = (dataset as { labelPrefer?: string }).labelPrefer;
            const prefer: 'above' | 'side' =
              preferRaw === 'side' ? 'side' : 'above';
            pendingPoints.push({
              px: el.x,
              py: el.y,
              lines,
              blockHeight,
              textWidth,
              pointRadius: Number(pointRadius) || 4,
              color,
              prefer,
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
        // Trend / connector polylines in canvas space — keep labels off them.
        const lineSegments: LineSegment[] = [];
        for (let di = 0; di < data.datasets.length; di++) {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) continue;
          const metaType = String(
            meta.type ?? (chart.config as { type?: string }).type ?? '',
          );
          if (metaType !== 'line') continue;
          const pts = meta.data
            .map((el) => {
              const p = el as { x?: number; y?: number; skip?: boolean };
              if (!p || p.skip || p.x == null || p.y == null) return null;
              return { x: p.x, y: p.y };
            })
            .filter((p): p is { x: number; y: number } => p != null);
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1]!;
            const b = pts[i]!;
            lineSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
          }
        }

        const placed = placePointLabels(
          pendingPoints,
          plotArea,
          chart.width ?? 400,
          lineSegments,
        );

        // Leader lines first (under text) — stop outside the glyph box.
        for (const label of placed) {
          if (!label.offset) continue;
          const geom = leaderGeometry(
            label.px,
            label.py,
            label.box,
            label.pointRadius,
            5,
          );
          if (!geom) continue;

          const lineColor = label.color || theme.secondaryText;
          ctx.beginPath();
          ctx.moveTo(geom.sx, geom.sy);
          ctx.lineTo(geom.ex, geom.ey);
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = 0.75;
          ctx.lineWidth = 1.25;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Small cap at the label end (same series color), outside the text.
          ctx.beginPath();
          ctx.arc(geom.ex, geom.ey, 1.75, 0, Math.PI * 2);
          ctx.fillStyle = lineColor;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Text on top — series color at full opacity; line 0 semibold, rest thinner.
        for (const label of placed) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = solidColor(label.color || theme.text, theme.text);
          ctx.textAlign = label.align;
          const block = label.blockHeight;
          let textY: number;
          if (label.baseline === 'middle') {
            textY = label.y - block / 2;
          } else if (label.baseline === 'bottom') {
            textY = label.y - block;
          } else {
            textY = label.y;
          }
          ctx.textBaseline = 'top';
          for (const line of label.lines) {
            ctx.font = `${line.weight} ${line.size}px ${theme.fontFamily}`;
            ctx.globalAlpha = 1;
            ctx.fillText(line.text, label.x, textY);
            textY += line.height;
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
 * **Dark / light awareness:** series colors (tokens, CSS vars, or raw hex) are
 * adapted against `--bg-color` so markers, fills, scatter labels, and leader
 * lines keep readable contrast when the theme flips. Theme changes rebuild the
 * chart via `data-theme` / class observers.
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
    // series path resolves tokens; raw `data` escape hatch still gets surface adaptation
    // so hard-coded hex palettes stay readable in dark mode (labels + markers).
    let chartData = data
      ? adaptChartDataColors(data, theme)
      : buildData(type, labels, series ?? [], resolvedPalette, styles, theme);
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
