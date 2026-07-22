/**
 * Scatter / bubble point focus: hover or click a point to pin it, dim the rest,
 * hide non-focused series labels, and draw dashed axis crosshairs with value
 * chips. Replaces the default floating tooltip for scatter-like charts.
 */
import type { Chart, ChartDataset, Plugin } from 'chart.js';

export type ScatterFocusRef = { datasetIndex: number; index: number };

export type ScatterFocusFormatters = {
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
};

export type ScatterFocusTheme = {
  brand: string;
  cardBg: string;
  fontFamily: string;
};

type FocusState = {
  pinned: ScatterFocusRef | null;
  hover: ScatterFocusRef | null;
  baseColors: string[];
  baseRadii: number[];
};

type ChartWithFocus = Chart & { $scatterFocus?: FocusState };

function focusKey(ref: ScatterFocusRef | null): string {
  return ref ? `${ref.datasetIndex}:${ref.index}` : '';
}

function activeFocus(state: FocusState | undefined): ScatterFocusRef | null {
  if (!state) return null;
  return state.pinned ?? state.hover;
}

function withAlpha(color: string, alpha: number): string {
  const c = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(c)) {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (/^#[0-9a-f]{3}$/i.test(c)) {
    const r = parseInt(c[1] + c[1], 16);
    const g = parseInt(c[2] + c[2], 16);
    const b = parseInt(c[3] + c[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const m = c.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );
  if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
  return c;
}

function solidFromColor(color: unknown, fallback: string): string {
  if (typeof color !== 'string' || !color) return fallback;
  const m = color.trim().match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );
  if (m) return `rgb(${m[1]}, ${m[2]}, ${m[3]})`;
  if (/^#[0-9a-f]{3,8}$/i.test(color.trim())) return color.trim().slice(0, 7);
  return color.trim() || fallback;
}

function extractBaseColor(ds: ChartDataset, fallback: string): string {
  const ext = ds as {
    pointBackgroundColor?: unknown;
    backgroundColor?: unknown;
    borderColor?: unknown;
  };
  const raw = ext.pointBackgroundColor ?? ext.backgroundColor ?? ext.borderColor;
  if (Array.isArray(raw) && raw.length > 0) return solidFromColor(raw[0], fallback);
  return solidFromColor(raw, fallback);
}

function extractBaseRadius(ds: ChartDataset): number {
  const r = (ds as { pointRadius?: number | number[] }).pointRadius;
  if (typeof r === 'number' && Number.isFinite(r)) return r;
  if (Array.isArray(r) && typeof r[0] === 'number') return r[0];
  return 4;
}

function defaultFormat(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 0.05) {
    return String(Math.round(value));
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function ensureState(chart: ChartWithFocus, brand: string): FocusState {
  const datasets = chart.data.datasets;
  if (!chart.$scatterFocus || chart.$scatterFocus.baseColors.length !== datasets.length) {
    chart.$scatterFocus = {
      pinned: null,
      hover: null,
      baseColors: datasets.map((ds) => extractBaseColor(ds, brand)),
      baseRadii: datasets.map((ds) => extractBaseRadius(ds)),
    };
  }
  return chart.$scatterFocus;
}

function applyFocusStyles(chart: ChartWithFocus, brand: string) {
  const state = ensureState(chart, brand);
  const focus = activeFocus(state);
  chart.data.datasets.forEach((ds, i) => {
    const base = state.baseColors[i] ?? brand;
    const baseR = state.baseRadii[i] ?? 4;
    const active = focus == null || focus.datasetIndex === i;
    const alpha = focus == null ? 0.55 : active ? 0.95 : 0.12;
    const fill = withAlpha(base, alpha);
    const radius = focus == null ? baseR : active ? baseR + 1.5 : Math.max(2.5, baseR - 0.5);
    const hoverRadius = focus == null ? baseR + 2 : active ? baseR + 2.5 : radius;

    ds.backgroundColor = fill;
    ds.borderColor = fill;
    (ds as { pointBackgroundColor?: string }).pointBackgroundColor = fill;
    (ds as { pointBorderColor?: string }).pointBorderColor = fill;
    (ds as { pointRadius?: number }).pointRadius = radius;
    (ds as { pointHoverRadius?: number }).pointHoverRadius = hoverRadius;
    (ds as { pointHitRadius?: number }).pointHitRadius = Math.max(16, radius + 10);

    const dsExt = ds as { datalabels?: boolean | { display?: boolean } };
    if (focus == null || active) {
      delete dsExt.datalabels;
    } else {
      dsExt.datalabels = false;
    }
  });
}

function hitFromEvent(chart: Chart, event: unknown): ScatterFocusRef | null {
  const els = chart.getElementsAtEventForMode(
    // Chart.js event typing varies by version
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event as any,
    'nearest',
    { intersect: true },
    false,
  );
  const el = els[0];
  if (!el) return null;
  return { datasetIndex: el.datasetIndex, index: el.index };
}

/**
 * Default scatter/bubble focus plugin: dim others + axis crosshairs with value chips.
 * Tooltips should be disabled when this plugin is active.
 */
export function createScatterFocusPlugin(opts?: {
  theme?: ScatterFocusTheme;
  formatters?: ScatterFocusFormatters;
}): Plugin {
  const brand = opts?.theme?.brand ?? '#2563eb';
  const cardBg = opts?.theme?.cardBg ?? '#111111';
  const fontFamily = opts?.theme?.fontFamily ?? 'system-ui, sans-serif';
  const formatX = opts?.formatters?.formatX ?? defaultFormat;
  const formatY = opts?.formatters?.formatY ?? defaultFormat;

  return {
    id: 'gltScatterFocus',
    afterInit(chart) {
      ensureState(chart as ChartWithFocus, brand);
    },
    afterEvent(chart, args) {
      const c = chart as ChartWithFocus;
      const state = ensureState(c, brand);
      const type = args.event.type;

      if (type === 'mouseout') {
        if (state.hover) {
          state.hover = null;
          applyFocusStyles(c, brand);
          chart.update('none');
        }
        return;
      }

      if (type !== 'mousemove' && type !== 'click') return;

      const hit = hitFromEvent(chart, args.event);
      const native = args.event.native as { target?: EventTarget | null } | null;
      if (native?.target instanceof HTMLElement) {
        native.target.style.cursor = hit || state.pinned ? 'pointer' : 'default';
      }

      if (type === 'click') {
        if (
          hit &&
          state.pinned &&
          state.pinned.datasetIndex === hit.datasetIndex &&
          state.pinned.index === hit.index
        ) {
          state.pinned = null;
        } else {
          state.pinned = hit;
        }
        state.hover = hit;
        applyFocusStyles(c, brand);
        chart.update('none');
        return;
      }

      // mousemove
      const prev = focusKey(activeFocus(state));
      state.hover = hit;
      const next = focusKey(activeFocus(state));
      if (prev === next) return;
      applyFocusStyles(c, brand);
      chart.update('none');
    },
    afterDatasetsDraw(chart) {
      const c = chart as ChartWithFocus;
      const state = ensureState(c, brand);
      const focus = activeFocus(state);
      if (!focus) return;

      const meta = chart.getDatasetMeta(focus.datasetIndex);
      const el = meta.data[focus.index] as { x: number; y: number } | undefined;
      if (!el) return;

      const raw = chart.data.datasets[focus.datasetIndex]?.data?.[focus.index] as
        | { x?: number; y?: number }
        | undefined;
      if (raw?.x == null || raw?.y == null) return;

      const { ctx, chartArea } = chart;
      const { left, right, top, bottom } = chartArea;
      const lineColor = state.baseColors[focus.datasetIndex] ?? brand;
      const px = el.x;
      const py = el.y;

      ctx.save();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.35;
      ctx.setLineDash([5, 4]);
      ctx.globalAlpha = 0.95;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(left, py);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(px, py, 6.5, 0, Math.PI * 2);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.75;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();

      const xLabel = formatX(raw.x);
      const yLabel = formatY(raw.y);
      ctx.font = `600 12px ${fontFamily}`;

      const padX = 7;
      const chipH = 18;

      const xMetrics = ctx.measureText(xLabel);
      const xChipW = xMetrics.width + padX * 2;
      let xChipX = px - xChipW / 2;
      xChipX = Math.max(left, Math.min(right - xChipW, xChipX));
      const xChipY = Math.min(bottom + 8, (chart.height ?? bottom + 28) - chipH - 2);
      roundRect(ctx, xChipX, xChipY, xChipW, chipH, 4);
      ctx.fillStyle = cardBg;
      ctx.globalAlpha = 0.94;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = lineColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(xLabel, xChipX + xChipW / 2, xChipY + chipH / 2);

      const yMetrics = ctx.measureText(yLabel);
      const yChipW = yMetrics.width + padX * 2;
      const yChipX = Math.max(2, left - yChipW - 8);
      let yChipY = py - chipH / 2;
      yChipY = Math.max(top, Math.min(bottom - chipH, yChipY));
      roundRect(ctx, yChipX, yChipY, yChipW, chipH, 4);
      ctx.fillStyle = cardBg;
      ctx.globalAlpha = 0.94;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.fillStyle = lineColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(yLabel, yChipX + yChipW / 2, yChipY + chipH / 2);

      ctx.restore();
    },
  };
}
