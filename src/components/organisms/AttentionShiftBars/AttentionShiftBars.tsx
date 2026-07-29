"use client";

import { Chart } from "@/components/organisms/Chart/Chart.js";
import type { ChartColorToken } from "@/components/organisms/Chart/Chart.js";
import type { BarElement, ChartType, Plugin } from "chart.js";

export type AttentionSlice = {
  key: string;
  label: string;
  before: number;
  after: number;
  color: ChartColorToken;
};

/** High-contrast bar colors (canvas cannot reliably paint raw CSS vars). */
const BAR_HEX: Record<string, string> = {
  implementation: "#3b82f6", // blue
  review: "#f59e0b", // amber
  spec: "#06b6d4", // cyan
  coordination: "#22c55e", // green
  coherence: "#a855f7", // violet
  brand: "#3b82f6",
  info: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  neutral: "#8b5cf6",
};

function barColor(slice: AttentionSlice): string {
  return BAR_HEX[slice.key] ?? BAR_HEX[slice.color] ?? "#3b82f6";
}

/**
 * Draw percentage values at the end of each horizontal bar.
 */
const barValueLabelsPlugin: Plugin<ChartType> = {
  id: "barValueLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const styles = getComputedStyle(chart.canvas);
    const textColor = styles.getPropertyValue("--text-color").trim() || "#1a1a1a";
    const fontFamily =
      styles.getPropertyValue("--font-family").trim() || "system-ui, sans-serif";

    ctx.save();
    ctx.font = `600 12px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const raw = dataset.data[index];
        const value = typeof raw === "number" ? raw : Number(raw);
        if (!Number.isFinite(value)) return;

        const bar = element as BarElement;
        const props = bar.getProps(["x", "y", "base"], true);
        const x = props.x ?? 0;
        const y = props.y ?? 0;
        const base = props.base ?? 0;
        const barEnd = Math.max(x, base);
        const label = `${value}%`;

        const chartRight = chart.chartArea?.right ?? x + 40;
        const outsideX = barEnd + 8;
        const fitsOutside = outsideX + ctx.measureText(label).width < chartRight - 4;

        if (fitsOutside) {
          ctx.textAlign = "left";
          ctx.fillText(label, outsideX, y);
        } else {
          ctx.textAlign = "right";
          // White-ish label inside colored bar for contrast
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, barEnd - 8, y);
          ctx.fillStyle = textColor;
        }
      });
    });

    ctx.restore();
  },
};

function AttentionBarChart({
  title,
  values,
  slices,
  height = 400,
  compact = false,
  shareLabel,
}: {
  title: string;
  values: "before" | "after";
  slices: readonly AttentionSlice[];
  height?: number;
  compact?: boolean;
  shareLabel: string;
}) {
  const colors = slices.map(barColor);

  return (
    <div className="min-w-0">
      <p
        className={[
          "text-center font-semibold uppercase tracking-wider text-[var(--text-color)]",
          compact ? "mb-1.5 text-[10px]" : "mb-3 text-sm",
        ].join(" ")}
      >
        {title}
      </p>
      <Chart
        type="bar"
        legend={false}
        // Extra height for multi-line y-axis labels on narrow viewports.
        height={height}
        // Category names live on the y-axis; percentages come from barValueLabelsPlugin.
        // Built-in Chart dataLabels would re-draw truncated names + bare values on top.
        // No chart legend: y-axis ticks + the figure table already name each bucket.
        dataLabels={false}
        // Wrap long buckets (e.g. "Coherence, architecture & harness"). Chart clamps
        // this to the panel width so mobile wraps instead of clipping — font size stays.
        categoryLabelMaxChars={22}
        // Bypass series color flattening — pass full chart.js data with per-bar colors
        data={{
          labels: slices.map((c) => c.label),
          datasets: [
            {
              label: shareLabel,
              data: slices.map((c) => c[values]),
              backgroundColor: colors,
              hoverBackgroundColor: colors,
              borderColor: colors,
              borderWidth: 0,
              borderRadius: 6,
              barPercentage: 0.78,
              categoryPercentage: 0.82,
            },
          ],
        }}
        plugins={[barValueLabelsPlugin]}
        options={{
          indexAxis: "y",
          layout: {
            padding: { top: 4, right: 44, bottom: 4, left: 4 },
          },
          scales: {
            x: {
              min: 0,
              max: 55,
              ticks: {
                callback: (v) => `${v}%`,
              },
            },
            y: {
              grid: { display: false },
              ticks: {
                padding: 8,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(ctx) {
                  return ` ${ctx.parsed.x}%`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

/** Side-by-side horizontal bar charts for the attention cost model. */
export function AttentionShiftBars({
  slices,
  compact = false,
  beforeTitle = "Before",
  afterTitle = "After",
  shareLabel = "Share %",
}: {
  slices: readonly AttentionSlice[];
  /** Dense layout for presentation slides (always 2-up, shorter bars). */
  compact?: boolean;
  beforeTitle?: string;
  afterTitle?: string;
  /** Dataset / tooltip label for the percentage share. */
  shareLabel?: string;
}) {
  const height = compact ? 210 : 400;
  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-3"
          : "grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8"
      }
    >
      <AttentionBarChart
        title={beforeTitle}
        values="before"
        slices={slices}
        height={height}
        compact={compact}
        shareLabel={shareLabel}
      />
      <AttentionBarChart
        title={afterTitle}
        values="after"
        slices={slices}
        height={height}
        compact={compact}
        shareLabel={shareLabel}
      />
    </div>
  );
}
