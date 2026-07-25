"use client";

import { Chart } from "@/components/organisms/Chart/Chart.js";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type ResolveRateTrendPoint = {
  period: string;
  model: string;
  resolveRate: number;
};

/** "2024 Q1" → 2024.0 ; "2026 Q3" → 2026.5 (linear quarter axis). */
function periodToTime(period: string): number {
  const m = period.trim().match(/^(\d{4})\s*Q([1-4])$/i);
  if (!m) return 0;
  return Number(m[1]) + (Number(m[2]) - 1) / 4;
}

function timeToPeriodLabel(t: number): string {
  const year = Math.floor(t + 1e-9);
  const q = Math.round((t - year) * 4) + 1;
  if (q < 1 || q > 4) return "";
  return `${year} Q${q}`;
}

/** Optional host-supplied short labels for leader lines. */
function shortModelName(model: string, map?: Readonly<Record<string, string>>): string {
  return map?.[model] ?? model;
}

function formatRate(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function pointLabel(p: ResolveRateTrendPoint, labelMap?: Readonly<Record<string, string>>): string {
  return `${shortModelName(p.model, labelMap)}\n${formatRate(p.resolveRate)}%`;
}

function withAlpha(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Plotted = ResolveRateTrendPoint & {
  t: number;
  isFrontier: boolean;
};

/**
 * Figure 2 — linear time on X; models in the same quarter share X and stack on Y.
 * The connector only follows the highest resolve rate in each quarter (frontier).
 * Labels + leaders stay clear of that path (glt-ui line-obstacle + side prefer).
 */
export function ResolveRateTrend({
  points,
  height,
  compact = false,
  fill = false,
  labelMap,
}: {
  points: readonly ResolveRateTrendPoint[];
  /** Override chart height (e.g. presentation slides). */
  height?: number;
  /** Prefer denser labels / aspect for slide embeds. */
  compact?: boolean;
  /**
   * Fill the parent box height (ResizeObserver). Parent must have a real height
   * (e.g. flex-1 min-h-0). Ignores fixed `height` when measured.
   */
  fill?: boolean;
  /** Optional short labels for models (leader lines). */
  labelMap?: Readonly<Record<string, string>>;
}) {
  const [narrow, setNarrow] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const [fillHeight, setFillHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (!fill) return;
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const h = Math.floor(el.clientHeight);
      if (h > 0) setFillHeight(h);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fill]);

  const brand = "#e8a017";

  const layout = useMemo(() => {
    if (points.length === 0) return null;

    // Max resolve rate per quarter → frontier envelope
    const maxByPeriod = new Map<string, number>();
    for (const p of points) {
      const prev = maxByPeriod.get(p.period) ?? -Infinity;
      if (p.resolveRate > prev) maxByPeriod.set(p.period, p.resolveRate);
    }

    const plotted: Plotted[] = points.map((p) => ({
      ...p,
      t: periodToTime(p.period),
      isFrontier: p.resolveRate === maxByPeriod.get(p.period),
    }));

    // One vertex per quarter (highest model), ordered in time
    const frontier = [...maxByPeriod.entries()]
      .map(([period, resolveRate]) => ({
        period,
        t: periodToTime(period),
        resolveRate,
      }))
      .sort((a, b) => a.t - b.t);

    const times = frontier.map((f) => f.t);
    const tMin = Math.min(...times);
    const tMax = Math.max(...times);

    // Markers + connector at 50% opacity so labels/leaders stay primary
    const stroke = withAlpha(brand, 0.5);
    const fillWash = withAlpha(brand, 0.08);

    // On phone, label frontier only; desktop also labels non-frontier (side leaders)
    const datasets = [
      {
        type: "line" as const,
        label: "Frontier (max per quarter)",
        data: frontier.map((f) => ({ x: f.t, y: f.resolveRate })),
        borderColor: stroke,
        backgroundColor: fillWash,
        fill: true,
        tension: 0.22,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 2,
        ...({ datalabels: false } as Record<string, unknown>),
      },
      ...plotted.map((p) => {
        const showLabel = narrow ? p.isFrontier : true;
        return {
          label: showLabel ? pointLabel(p, labelMap) : "\u200b",
          data: [{ x: p.t, y: p.resolveRate }],
          backgroundColor: stroke,
          borderColor: stroke,
          pointBackgroundColor: stroke,
          pointBorderColor: stroke,
          // Compact markers (frontier slightly larger)
          pointRadius: p.isFrontier ? 3 : 2.5,
          pointHoverRadius: 5,
          order: 1,
          // Peaks: prefer above; same-quarter lower models: prefer side so
          // leaders do not cut through the frontier line.
          ...({
            labelPrefer: p.isFrontier ? "above" : "side",
            ...(showLabel ? {} : { datalabels: false }),
          } as Record<string, unknown>),
        };
      }),
    ];

    return { datasets, tMin, tMax, frontier };
  }, [points, narrow, labelMap]);

  if (!layout) return null;
  const { datasets, tMin, tMax } = layout;

  // Quarter ticks from first data quarter through last (include empty quarters)
  const tickStart = Math.floor(tMin * 4) / 4;
  const tickEnd = Math.ceil(tMax * 4) / 4;

  const chartHeight =
    fill && fillHeight != null
      ? fillHeight
      : (height ?? (compact ? 260 : narrow ? 380 : 520));
  // When height is fixed (or fill-measured), Chart turns off maintainAspectRatio.
  const chartAspect = compact ? 1.65 : narrow ? 1.1 : 1.5;

  const chart = (
    <Chart
      type="scatter"
      height={chartHeight}
      aspectRatio={chartAspect}
      legend={false}
      dataLabels
      scatterFocus={{
        formatX: (t) => timeToPeriodLabel(t) || String(t),
        formatY: (v) => `${formatRate(v)}%`,
      }}
      data={{ datasets }}
      options={{
        layout: {
          padding: narrow || compact || fill
            ? { top: 36, right: 40, bottom: 24, left: 28 }
            : { top: 56, right: 76, bottom: 28, left: 36 },
        },
        scales: {
          x: {
            type: "linear",
            min: tickStart - 0.12,
            max: tickEnd + 0.18,
            offset: false,
            title: {
              display: true,
              text: "Time (quarter)",
            },
            ticks: {
              // One tick per calendar quarter on a fixed linear axis
              stepSize: 0.25,
              autoSkip: false,
              maxRotation: narrow ? 50 : 35,
              minRotation: 0,
              callback(value) {
                const t = typeof value === "number" ? value : Number(value);
                // Only exact quarter boundaries
                const qIndex = t * 4;
                if (Math.abs(qIndex - Math.round(qIndex)) > 1e-6) return "";
                const label = timeToPeriodLabel(t);
                if (!label) return "";
                // On narrow screens, skip empty mid years slightly if dense
                if (narrow) {
                  const year = Math.floor(t + 1e-9);
                  const q = Math.round((t - year) * 4) + 1;
                  // Keep Q1 and Q3 labels on phone to reduce clutter
                  if (q === 2 || q === 4) {
                    // Still show if this quarter has data
                    const has = points.some((p) => periodToTime(p.period) === t);
                    if (!has) return "";
                  }
                }
                return label;
              },
            },
          },
          y: {
            min: 0,
            max: 112,
            ticks: {
              stepSize: 20,
              callback(value) {
                const v = typeof value === "number" ? value : Number(value);
                if (v > 100) return "";
                return String(v);
              },
            },
            title: {
              display: true,
              text: "Resolve rate (%)",
            },
          },
        },
      }}
    />
  );

  if (fill) {
    return (
      <div ref={hostRef} className="h-full min-h-0 w-full">
        {chart}
      </div>
    );
  }

  return chart;
}

export default ResolveRateTrend;
