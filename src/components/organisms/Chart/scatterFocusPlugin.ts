/**
 * Scatter / bubble point focus: hover or click a point to pin it, dim the rest,
 * hide non-focused series labels, and draw dashed axis crosshairs with value
 * chips. Replaces the default floating tooltip for scatter-like charts.
 *
 * Restores full original dataset paint (fill wash, border, radii, datalabels)
 * on unfocus so mixed line+point charts (e.g. frontier envelopes) do not keep
 * corrupted area fills or accidental value labels.
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

/** Snapshot of dataset visual props we may mutate while focused. */
type DatasetSnapshot = {
  backgroundColor: unknown;
  borderColor: unknown;
  pointBackgroundColor: unknown;
  pointBorderColor: unknown;
  pointRadius: unknown;
  pointHoverRadius: unknown;
  pointHitRadius: unknown;
  datalabels: unknown;
  borderWidth: unknown;
  fill: unknown;
};

type FocusState = {
  pinned: ScatterFocusRef | null;
  hover: ScatterFocusRef | null;
  snapshots: DatasetSnapshot[];
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

function firstColor(raw: unknown, fallback: string): string {
  if (Array.isArray(raw) && raw.length > 0) return solidFromColor(raw[0], fallback);
  return solidFromColor(raw, fallback);
}

function captureSnapshot(ds: ChartDataset): DatasetSnapshot {
  const d = ds as unknown as Record<string, unknown>;
  return {
    backgroundColor: d.backgroundColor,
    borderColor: d.borderColor,
    pointBackgroundColor: d.pointBackgroundColor,
    pointBorderColor: d.pointBorderColor,
    pointRadius: d.pointRadius,
    pointHoverRadius: d.pointHoverRadius,
    pointHitRadius: d.pointHitRadius,
    datalabels: d.datalabels,
    borderWidth: d.borderWidth,
    fill: d.fill,
  };
}

function restoreSnapshot(ds: ChartDataset, snap: DatasetSnapshot) {
  const d = ds as unknown as Record<string, unknown>;
  d.backgroundColor = snap.backgroundColor;
  d.borderColor = snap.borderColor;
  d.pointBackgroundColor = snap.pointBackgroundColor;
  d.pointBorderColor = snap.pointBorderColor;
  d.pointRadius = snap.pointRadius;
  d.pointHoverRadius = snap.pointHoverRadius;
  d.pointHitRadius = snap.pointHitRadius;
  d.borderWidth = snap.borderWidth;
  d.fill = snap.fill;
  if (snap.datalabels === undefined) {
    delete d.datalabels;
  } else {
    d.datalabels = snap.datalabels;
  }
}

function isAreaLineDataset(ds: ChartDataset): boolean {
  const d = ds as { type?: string; fill?: boolean | string; pointRadius?: number | number[] };
  if (d.type === 'line') return true;
  if (d.fill === true || d.fill === 'origin' || d.fill === 'start' || d.fill === 'end') {
    return true;
  }
  // No visible points → treat as connector/envelope, not a focusable scatter mark set
  if (d.pointRadius === 0) return true;
  if (Array.isArray(d.pointRadius) && d.pointRadius.every((r) => r === 0)) return true;
  return false;
}

function pointRadiusOf(snap: DatasetSnapshot, fallback = 4): number {
  const r = snap.pointRadius;
  if (typeof r === 'number' && Number.isFinite(r)) return r;
  if (Array.isArray(r) && typeof r[0] === 'number') return r[0];
  return fallback;
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
  if (!chart.$scatterFocus || chart.$scatterFocus.snapshots.length !== datasets.length) {
    chart.$scatterFocus = {
      pinned: null,
      hover: null,
      snapshots: datasets.map((ds) => captureSnapshot(ds)),
    };
  }
  void brand;
  return chart.$scatterFocus;
}

function applyFocusStyles(chart: ChartWithFocus, brand: string) {
  const state = ensureState(chart, brand);
  const focus = activeFocus(state);

  // Full restore when nothing is focused — exact original paint.
  if (focus == null) {
    chart.data.datasets.forEach((ds, i) => {
      const snap = state.snapshots[i];
      if (snap) restoreSnapshot(ds, snap);
    });
    return;
  }

  chart.data.datasets.forEach((ds, i) => {
    const snap = state.snapshots[i];
    if (!snap) return;
    const active = i === focus.datasetIndex;
    const areaLine = isAreaLineDataset(ds) || isAreaLineDataset({ ...ds, ...snap } as ChartDataset);

    if (active) {
      restoreSnapshot(ds, snap);
      const baseR = pointRadiusOf(snap, 4);
      if (baseR > 0) {
        (ds as { pointRadius?: number }).pointRadius = baseR + 1.5;
        (ds as { pointHoverRadius?: number }).pointHoverRadius = baseR + 2.5;
      }
      // Keep original datalabels (do not force-enable a series that was off)
      return;
    }

    // Dim inactive series — never invent labels on unfocused series
    (ds as { datalabels?: boolean }).datalabels = false;

    if (areaLine) {
      // Preserve envelope geometry; only wash out stroke / fill.
      const strokeBase = firstColor(snap.borderColor ?? snap.backgroundColor, brand);
      const fillBase = firstColor(snap.backgroundColor ?? snap.borderColor, brand);
      (ds as { borderColor?: string }).borderColor = withAlpha(strokeBase, 0.12);
      (ds as { backgroundColor?: string }).backgroundColor = withAlpha(fillBase, 0.03);
      (ds as { pointBackgroundColor?: string }).pointBackgroundColor = withAlpha(strokeBase, 0.12);
      (ds as { pointBorderColor?: string }).pointBorderColor = withAlpha(strokeBase, 0.12);
      if (pointRadiusOf(snap, 0) > 0) {
        (ds as { pointRadius?: number }).pointRadius = Math.max(1.5, pointRadiusOf(snap) - 0.5);
      }
      return;
    }

    const base = firstColor(
      snap.pointBackgroundColor ?? snap.backgroundColor ?? snap.borderColor,
      brand,
    );
    const fill = withAlpha(base, 0.12);
    const baseR = pointRadiusOf(snap, 4);
    (ds as { backgroundColor?: string }).backgroundColor = fill;
    (ds as { borderColor?: string }).borderColor = fill;
    (ds as { pointBackgroundColor?: string }).pointBackgroundColor = fill;
    (ds as { pointBorderColor?: string }).pointBorderColor = fill;
    (ds as { pointRadius?: number }).pointRadius = Math.max(2.5, baseR - 0.5);
    (ds as { pointHoverRadius?: number }).pointHoverRadius = Math.max(2.5, baseR - 0.5);
    (ds as { pointHitRadius?: number }).pointHitRadius = Math.max(16, baseR + 10);
  });
}

function hitFromEvent(chart: Chart, event: unknown): ScatterFocusRef | null {
  const els = chart.getElementsAtEventForMode(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event as any,
    'nearest',
    { intersect: true },
    false,
  );
  // Prefer a real marker hit (pointRadius > 0) over an invisible line vertex
  for (const el of els) {
    const ds = chart.data.datasets[el.datasetIndex] as { pointRadius?: number | number[] };
    const r = ds?.pointRadius;
    if (r === 0) continue;
    if (Array.isArray(r) && r[el.index] === 0) continue;
    return { datasetIndex: el.datasetIndex, index: el.index };
  }
  const el = els[0];
  if (!el) return null;
  // Skip pure area/line envelope series for pinning
  const ds = chart.data.datasets[el.datasetIndex];
  if (ds && isAreaLineDataset(ds)) return null;
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
      const snap = state.snapshots[focus.datasetIndex];
      const lineColor = firstColor(
        snap?.pointBackgroundColor ?? snap?.backgroundColor ?? snap?.borderColor,
        brand,
      );
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
