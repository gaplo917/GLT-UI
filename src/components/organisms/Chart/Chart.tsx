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
   * Draw category label + value on each data point / slice / bar.
   * Defaults to `true`. Set `false` to hide on-chart annotations.
   */
  dataLabels?: boolean;
  /** Extra chart.js plugins. */
  plugins?: Plugin[];
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

/**
 * Built-in plugin: paints a name + numeric value on every visible element
 * (bars, slices, points). Theme-aware; skip with `dataLabels={false}`.
 *
 * Text content:
 * - **Circular** (pie / doughnut / polarArea): category label + value
 * - **Multi-series** cartesian: series label + value
 * - **Single-series** cartesian: category label + value
 */
function createDataLabelsPlugin(theme: Theme): Plugin {
  const lineHeight = 13;
  const fontSize = 11;

  return {
    id: 'gltDataLabels',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      const multiSeries = data.datasets.length > 1;

      ctx.save();
      ctx.font = `600 ${fontSize}px ${theme.fontFamily}`;
      ctx.textBaseline = 'middle';

      for (let di = 0; di < data.datasets.length; di++) {
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) continue;
        const dataset = data.datasets[di];

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
          };
          if (!el || el.skip) continue;

          const raw = Array.isArray(dataset.data) ? dataset.data[i] : undefined;
          if (raw == null || (typeof raw === 'number' && !Number.isFinite(raw))) continue;

          const valueText = formatDataValue(raw);
          if (!valueText) continue;

          const category =
            data.labels && data.labels[i] != null ? String(data.labels[i]) : undefined;
          const seriesName = dataset.label ? String(dataset.label) : undefined;
          const arc = isArcLikeElement(el);

          // Prefer the most useful name for this geometry.
          const nameText = arc
            ? category ?? seriesName
            : multiSeries
              ? seriesName ?? category
              : category ?? seriesName;

          const lines = nameText ? [nameText, valueText] : [valueText];

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
            // Line / radar / scatter / bubble — sit just above the marker.
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
 * On-chart **label + value** annotations are drawn by default for every type
 * (`dataLabels={false}` to hide). Drop down to raw chart.js via `data`,
 * `options`, and `plugins`.
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
  plugins,
  className,
  ...rest
}: ChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartRef = React.useRef<ChartJS | null>(null);
  const [themeTick, setThemeTick] = React.useState(0);

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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(canvas);
    const theme = resolveTheme(styles);
    const resolvedPalette = palette ?? DEFAULT_PALETTE;
    const chartData = data ?? buildData(type, labels, series ?? [], resolvedPalette, styles);
    const themedOptions = buildThemedOptions(theme, {
      type,
      legend,
      stacked,
      showGrid,
      height,
      aspectRatio,
    } as ChartProps);
    const finalOptions = deepMerge<ChartOptions>(themedOptions, options);
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
    plugins,
    themeTick,
  ]);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...rest}>
      {title != null && (
        <Text as="div" size="lg" weight="semibold" tone="strong">
          {title}
        </Text>
      )}
      <div className="relative w-full" style={height != null ? { height } : undefined}>
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
