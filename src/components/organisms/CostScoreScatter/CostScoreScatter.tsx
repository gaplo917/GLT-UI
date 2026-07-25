"use client";

import { Chart } from "@/components/organisms/Chart/Chart.js";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

export type CostScorePoint = {
  model: string;
  /** Concise on-chart label, e.g. "GPT-5.6 Sol · max" or "Opus 4.8 · high". */
  chartLabel: string;
  effort: string;
  resolveRate: number;
  /** Average $ per task. Null when unpublished. */
  costPerTest: number | null;
  /** Suite size used for totalCost (500 Verified, 113 DeepSWE). */
  taskCount: number;
  color: string;
  /** X-axis title for the active benchmark. */
  xAxisLabel?: string;
  /** Y-axis title for the active benchmark. */
  yAxisLabel?: string;
};

/**
 * Total cost to run the full suite: costPerTest × taskCount.
 */
function suiteTotal(costPerTest: number, taskCount: number) {
  return costPerTest * taskCount;
}

/** Apply alpha to hex / rgb(a) so markers stay readable on any theme. */
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

/**
 * Split "Name · effort" chart labels into title + second-line meta for glt-ui
 * scatter dataLabels (`Title\neffort` → thinner second line).
 */
function scatterSeriesLabel(point: CostScorePoint): string {
  const raw = point.chartLabel.trim();
  if (raw.includes(" · ")) {
    const i = raw.lastIndexOf(" · ");
    const primary = raw.slice(0, i).trim();
    const secondary = raw.slice(i + 3).trim();
    if (primary && secondary) return `${primary}\n${secondary}`;
  }
  if (point.effort && point.effort !== "default") {
    return `${raw}\n${point.effort}`;
  }
  return raw;
}

function formatSuiteCost(value: number): string {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  if (value >= 100) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatResolve(value: number): string {
  const rounded =
    Math.abs(value - Math.round(value)) < 0.05
      ? Math.round(value)
      : Math.round(value * 10) / 10;
  return `${rounded}%`;
}

/**
 * Figure 4 scatter. Point focus (dim others + axis chips) is the glt-ui Chart
 * default for scatter; we only supply suite-cost / resolve formatters.
 */
export function CostScoreScatter({
  points,
  xAxisLabel = "Total suite cost ($)",
  yAxisLabel = "Resolve rate (%)",
  height,
  fill = false,
}: {
  points: readonly CostScorePoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  /** Fixed chart height. Prefer `fill` inside flex slide panels. */
  height?: number;
  /** Fill parent height via ResizeObserver. */
  fill?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fillHeight, setFillHeight] = useState<number | null>(null);

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

  const withTotal = useMemo(
    () =>
      points
        .filter(
          (p): p is CostScorePoint & { costPerTest: number } =>
            p.costPerTest != null,
        )
        .map((p) => ({
          ...p,
          totalCost: suiteTotal(p.costPerTest, p.taskCount),
        })),
    [points],
  );

  const chartData = useMemo(
    () => ({
      datasets: withTotal.map((m) => {
        const fill = withAlpha(m.color, 0.55);
        return {
          label: scatterSeriesLabel(m),
          data: [{ x: m.totalCost, y: m.resolveRate }],
          backgroundColor: fill,
          borderColor: fill,
          pointBackgroundColor: fill,
          pointBorderColor: fill,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHitRadius: 18,
        };
      }),
    }),
    [withTotal],
  );

  const options = useMemo(() => {
    if (withTotal.length === 0) return {};
    const maxX = Math.max(...withTotal.map((p) => p.totalCost)) * 1.15;
    const minY = Math.min(...withTotal.map((p) => p.resolveRate));
    const yMin = Math.max(0, Math.floor((minY - 8) / 5) * 5);
    const xStep = maxX > 2000 ? 250 : maxX > 800 ? 100 : 50;

    return {
      layout: {
        padding: fill
          ? { top: 28, right: 28, bottom: 20, left: 28 }
          : { top: 44, right: 36, bottom: 28, left: 36 },
      },
      scales: {
        x: {
          min: 0,
          max: Math.ceil(maxX / xStep) * xStep,
          title: {
            display: true,
            text: xAxisLabel,
          },
        },
        y: {
          min: yMin,
          max: 100,
          title: {
            display: true,
            text: yAxisLabel,
          },
        },
      },
    };
  }, [withTotal, xAxisLabel, yAxisLabel, fill]);

  if (withTotal.length === 0) {
    return null;
  }

  const chartHeight =
    fill && fillHeight != null ? fillHeight : (height ?? 520);

  const chart = (
    <Chart
      type="scatter"
      height={chartHeight}
      aspectRatio={1.1}
      legend={false}
      dataLabels
      scatterFocus={{
        formatX: formatSuiteCost,
        formatY: formatResolve,
      }}
      data={chartData}
      options={options}
    />
  );

  return (
    <div
      ref={fill ? hostRef : undefined}
      className={[
        "cost-score-scatter relative w-full min-w-0",
        fill ? "h-full min-h-0" : "",
      ].join(" ")}
      data-figure="cost-score-scatter"
    >
      {chart}
    </div>
  );
}
