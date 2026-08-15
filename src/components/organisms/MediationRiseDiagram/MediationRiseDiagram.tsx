'use client';

/**
 * A quantitative time-series view of first-party AI mediation milestones.
 * The main measure stays on a chart axis; metrics with incompatible units are
 * separated into evidence cards rather than plotted on the same scale.
 */

import type { ChartOptions, Plugin } from 'chart.js';
import { Chart } from '@/components/organisms/Chart/Chart.js';
import { RefCite } from '@/components/molecules/RefCite/RefCite.js';
import type { RefCiteItem } from '@/components/molecules/RefCite/refCiteTypes.js';

export type MediationRiseLevel = {
  id: string;
  value: string;
  period: string;
  share: number;
  t?: number;
  citeKey?: string;
};

export type MediationRiseSeries = {
  id: string;
  label: string;
  levels: readonly MediationRiseLevel[];
};

export type MediationRiseChip = {
  id: string;
  label: string;
  value: string;
  citeKey?: string;
};

export type MediationRiseDiagramProps = {
  levels?: readonly MediationRiseLevel[];
  series?: readonly MediationRiseSeries[];
  chips?: readonly MediationRiseChip[];
  cites?: Partial<Record<string, readonly RefCiteItem[]>>;
  timeLabel?: string;
  shareLabel?: string;
  gateLabel?: string;
  thresholdLabel?: string;
  thresholdShare?: number;
  claim?: string;
  title?: string;
  description?: string;
  className?: string;
  /** Condensed chart-only composition for constrained presentation boards. */
  compact?: boolean;
};

function resolveSeries(
  series: readonly MediationRiseSeries[] | undefined,
  levels: readonly MediationRiseLevel[] | undefined,
): MediationRiseSeries[] {
  if (series?.length) return [...series];
  if (levels?.length) return [{ id: 'primary', label: 'Public series', levels }];
  return [];
}

function thresholdPlugin(threshold: number): Plugin<'line'> {
  return {
    id: `mediation-threshold-${threshold}`,
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const y = scales.y?.getPixelForValue(threshold);
      if (y == null || !Number.isFinite(y)) return;
      const styles = getComputedStyle(chart.canvas);
      const brand = styles.getPropertyValue('--brand-primary').trim() || styles.color;
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = brand;
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, y - chartArea.top);
      ctx.globalAlpha = 0.75;
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = brand;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
      ctx.restore();
    },
  };
}

export function MediationRiseDiagram({
  levels,
  series,
  chips,
  cites,
  timeLabel = 'First-party public milestones',
  shareLabel = 'Engineer-accepted AI share',
  gateLabel = 'Human accept / review gate',
  thresholdLabel = 'Majority threshold',
  thresholdShare = 50,
  claim = 'Mediation rises. Review stays human.',
  title = '',
  description = '',
  className,
  compact = false,
}: MediationRiseDiagramProps) {
  const resolved = resolveSeries(series, levels);
  if (!resolved.length) return null;

  const primary = resolved[0];
  const labels = primary.levels.map((level) => level.period);
  const options: ChartOptions<'line'> = {
    layout: { padding: { top: 30, right: 20, bottom: 4, left: 4 } },
    scales: {
      x: {
        title: { display: true, text: timeLabel },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        max: 100,
        title: { display: true, text: shareLabel },
        ticks: { callback: (value) => `${value}%`, stepSize: 25 },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${primary.levels[context.dataIndex]?.value ?? context.formattedValue}`,
        },
      },
    },
  };

  return (
    <section
      className={['mrd-chart w-full min-w-0', compact ? 'mrd-chart--compact' : '', className ?? ''].filter(Boolean).join(' ')}
      data-figure="mediation-rise"
      aria-label={title || description || 'Mediation rise chart'}
    >
      <style>{css}</style>
      <div className="mrd-chart__message">
        <div>
          <p className="mrd-chart__eyebrow">Observed production mediation</p>
          <p className="mrd-chart__claim">{claim}</p>
        </div>
        <div className="mrd-chart__threshold">
          <span>{thresholdLabel}</span>
          <strong>{thresholdShare}%</strong>
        </div>
      </div>

      <Chart
        type="line"
        labels={labels}
        series={resolved.map((item) => ({
          label: item.label,
          data: item.levels.map((level) => level.share),
          color: 'brand',
          fill: true,
          dataset: {
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            tension: 0.12,
          },
        }))}
        options={options}
        plugins={[thresholdPlugin(thresholdShare)]}
        legend={false}
        showGrid
        dataLabels
        aspectRatio={compact ? 4 : 2.15}
        ariaLabel={description || title || 'Engineer-accepted AI code share over time'}
      />

      {!compact ? <div className="mrd-chart__evidence" aria-label="Milestone evidence">
        {primary.levels.map((level) => (
          <div className="mrd-chart__milestone" key={level.id}>
            <span>{level.period}</span>
            <strong>{level.value}</strong>
            {level.citeKey && cites?.[level.citeKey]?.length ? (
              <RefCite items={cites[level.citeKey] ?? []} />
            ) : null}
          </div>
        ))}
        {(chips ?? []).map((chip) => (
          <div className="mrd-chart__milestone mrd-chart__milestone--different-unit" key={chip.id}>
            <span>{chip.label} · different unit</span>
            <strong>{chip.value}</strong>
            {chip.citeKey && cites?.[chip.citeKey]?.length ? (
              <RefCite items={cites[chip.citeKey] ?? []} />
            ) : null}
          </div>
        ))}
      </div> : null}

      {!compact ? <div className="mrd-chart__gate">
        <span aria-hidden="true">✓</span>
        <strong>{gateLabel}</strong>
        <span>Every reported code milestone remains subject to engineer approval.</span>
      </div> : null}
    </section>
  );
}

const css = `
.mrd-chart { font-family: var(--font-family), system-ui, sans-serif; }
.mrd-chart__message { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; margin:0 0 .75rem; }
.mrd-chart__eyebrow { margin:0 0 .2rem; color:var(--brand-primary); font:700 .72rem/1.2 var(--font-mono, ui-monospace, monospace); letter-spacing:.06em; text-transform:uppercase; }
.mrd-chart__claim { margin:0; color:var(--strong-text-color); font-size:1rem; font-weight:700; }
.mrd-chart__threshold { flex:none; display:flex; align-items:baseline; gap:.5rem; padding:.45rem .65rem; border:1px solid color-mix(in srgb, var(--brand-primary) 42%, var(--border-color)); border-radius:.65rem; background:color-mix(in srgb, var(--brand-primary) 8%, var(--card-bg-color)); color:var(--secondary-text-color); font-size:.75rem; }
.mrd-chart__threshold strong { color:var(--brand-primary); font-size:1rem; }
.mrd-chart__evidence { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.5rem; margin-top:.65rem; }
.mrd-chart__milestone { min-width:0; padding:.55rem .65rem; border:1px solid var(--border-color); border-radius:.65rem; background:var(--card-bg-color); }
.mrd-chart__milestone span { display:block; overflow:hidden; color:var(--secondary-text-color); font-size:.7rem; line-height:1.25; text-overflow:ellipsis; white-space:nowrap; }
.mrd-chart__milestone strong { display:inline-block; margin-top:.18rem; color:var(--strong-text-color); font-size:.95rem; }
.mrd-chart__milestone--different-unit { border-style:dashed; }
.mrd-chart__milestone--different-unit strong { color:var(--brand-primary); }
.mrd-chart__gate { display:grid; grid-template-columns:auto auto 1fr; align-items:center; gap:.45rem; margin-top:.6rem; padding:.55rem .7rem; border-radius:.65rem; background:color-mix(in srgb, var(--brand-primary) 8%, transparent); color:var(--secondary-text-color); font-size:.76rem; }
.mrd-chart__gate > span:first-child, .mrd-chart__gate strong { color:var(--brand-primary); }
.mrd-chart--compact .mrd-chart__message { margin-bottom:.25rem; }
.mrd-chart--compact .mrd-chart__eyebrow { font-size:.64rem; }
.mrd-chart--compact .mrd-chart__claim { font-size:.86rem; }
.mrd-chart--compact .mrd-chart__threshold { padding:.3rem .5rem; }
@media (max-width:640px) {
  .mrd-chart__message { align-items:flex-start; flex-direction:column; }
  .mrd-chart__evidence { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .mrd-chart__gate { grid-template-columns:auto 1fr; }
  .mrd-chart__gate > span:last-child { grid-column:1 / -1; }
}
`;

export default MediationRiseDiagram;
