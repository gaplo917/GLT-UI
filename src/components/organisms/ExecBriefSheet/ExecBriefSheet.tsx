import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type ExecBriefAttentionRow = {
  label: string;
  before: number;
  after: number;
};

export type ExecBriefAccent = 'brand' | 'info' | 'success' | 'warning';

export type ExecBriefPanel = {
  n: number;
  title: string;
  accent?: ExecBriefAccent;
  body: React.ReactNode;
  takeaway?: React.ReactNode;
};

export interface ExecBriefSheetProps {
  layout?: 'responsive' | 'sheet';
  className?: string;
  /** Small label next to the title (e.g. series / topic line). */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Lede under the title row (host may pass multiple paragraphs). */
  subtitle?: React.ReactNode;
  /** Header meta slot (e.g. date badge). */
  meta?: React.ReactNode;
  /**
   * Attention-shift rows for the built-in delta table helper.
   * Hosts typically pass these into `ExecBriefAttentionTable` inside a panel body;
   * when `panels` is omitted and rows are set, a single attention panel is composed.
   */
  attentionRows?: readonly ExecBriefAttentionRow[];
  attentionTitle?: string;
  /** Caption above the attention table. */
  attentionCaption?: React.ReactNode;
  attentionTakeaway?: React.ReactNode;
  /** Scale max for mini bars (default: max of before/after, min 1). */
  attentionMax?: number;
  attentionBeforeLabel?: string;
  attentionAfterLabel?: string;
  attentionDeltaLabel?: string;
  /** Optional checklist blocks (✓ / ✗). Used when composing without full panels. */
  doItems?: readonly React.ReactNode[];
  dontItems?: readonly React.ReactNode[];
  doTitle?: string;
  dontTitle?: string;
  /**
   * Free-form numbered panels (2×2 on sm+ / sheet; stacked on phone in responsive).
   * Preferred host API for full briefs.
   */
  panels?: readonly ExecBriefPanel[];
  /** Footer region (myth cards, watch list, etc.). */
  footer?: React.ReactNode;
}

function accentRing(accent: ExecBriefAccent): string {
  if (accent === 'info') return 'border-[var(--color-info)]/35';
  if (accent === 'success') return 'border-[var(--color-success)]/35';
  if (accent === 'warning') return 'border-[var(--color-warning)]/35';
  return 'border-[var(--brand-primary)]/30';
}

function accentBadge(accent: ExecBriefAccent): string {
  if (accent === 'info') return 'bg-[var(--color-info)]/15 text-[var(--color-info)]';
  if (accent === 'success')
    return 'bg-[var(--color-success)]/15 text-[var(--color-success)]';
  if (accent === 'warning')
    return 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]';
  return 'bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]';
}

/** Signed delta with success (negative / down) vs danger (positive / up) coloring. */
export function ExecBriefDelta({ n }: { n: number }) {
  const pos = n > 0;
  return (
    <span
      className={
        pos
          ? 'font-semibold tabular-nums text-[var(--color-danger)]'
          : 'font-semibold tabular-nums text-[var(--color-success)]'
      }
    >
      {pos ? '+' : ''}
      {n}
    </span>
  );
}

/** Compact checklist row with ✓ / ✗ marks. */
export function ExecBriefListItem({
  ok = true,
  children,
}: {
  ok?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-1 text-[0.6rem] leading-snug text-[var(--text-color)] sm:text-[0.65rem]">
      <span
        className={
          ok === false
            ? 'shrink-0 font-bold text-[var(--color-danger)]'
            : 'shrink-0 font-bold text-[var(--color-success)]'
        }
        aria-hidden
      >
        {ok === false ? '✗' : '✓'}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Bottom hinge line inside a panel. */
export function ExecBriefTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 mt-auto shrink-0 rounded border border-[var(--brand-primary)]/25 bg-[var(--brand-primary)]/10 px-1.5 py-1 text-[0.58rem] leading-snug text-[var(--text-color)] sm:text-[0.62rem]">
      <span className="font-semibold text-[var(--brand-primary)]">→ </span>
      {children}
    </p>
  );
}

/** Dense before/after share table with dual mini bars and Δpp. */
export function ExecBriefAttentionTable({
  rows,
  max: maxProp,
  caption,
  beforeLabel = 'Hum',
  afterLabel = 'Agt',
  deltaLabel = 'Δpp',
  className,
}: {
  rows: readonly ExecBriefAttentionRow[];
  max?: number;
  caption?: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  deltaLabel?: string;
  className?: string;
}) {
  const computedMax = React.useMemo(() => {
    if (maxProp != null && maxProp > 0) return maxProp;
    let m = 1;
    for (const row of rows) {
      m = Math.max(m, row.before, row.after);
    }
    return m;
  }, [rows, maxProp]);

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-1.5', className)}>
      {caption != null && (
        <p className="m-0 text-[0.55rem] leading-snug text-[var(--secondary-text-color)]">
          {caption}
        </p>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_1.75rem_1.75rem_1.75rem] gap-x-1 text-[0.5rem] font-semibold uppercase tracking-wide text-[var(--secondary-text-color)]">
        <span />
        <span className="text-right">{beforeLabel}</span>
        <span className="text-right text-[var(--brand-primary)]">{afterLabel}</span>
        <span className="text-right">{deltaLabel}</span>
      </div>
      {rows.map((row) => {
        const w1 = Math.max(6, (row.before / computedMax) * 100);
        const w2 = Math.max(6, (row.after / computedMax) * 100);
        return (
          <div key={row.label} className="space-y-0.5">
            <div className="grid grid-cols-[minmax(0,1fr)_1.75rem_1.75rem_1.75rem] items-center gap-x-1 text-[0.58rem] leading-tight">
              <span className="min-w-0 truncate font-medium">{row.label}</span>
              <span className="text-right tabular-nums text-[var(--secondary-text-color)]">
                {row.before}
              </span>
              <span className="text-right tabular-nums font-semibold">{row.after}</span>
              <span className="text-right">
                <ExecBriefDelta n={row.after - row.before} />
              </span>
            </div>
            <div className="flex gap-0.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--border-color)]/35">
                <div
                  className="h-full rounded-full bg-[var(--secondary-text-color)]/45"
                  style={{ width: `${w1}%` }}
                />
              </div>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--border-color)]/35">
                <div
                  className="h-full rounded-full bg-[var(--brand-primary)]"
                  style={{ width: `${w2}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PanelShell({
  n,
  title,
  accent = 'brand',
  children,
}: {
  n: number;
  title: string;
  accent?: ExecBriefAccent;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex min-h-0 flex-col gap-1.5 rounded-lg border bg-[var(--bg-color)]/55 p-2 sm:p-2.5',
        accentRing(accent),
      )}
    >
      <h3 className="m-0 flex shrink-0 items-center gap-1.5 text-[0.72rem] font-bold leading-tight tracking-tight text-[var(--strong-text-color)] sm:text-[0.78rem]">
        <span
          className={cn(
            'inline-flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full text-[0.58rem] font-bold',
            accentBadge(accent),
          )}
        >
          {n}
        </span>
        <span className="min-w-0">{title}</span>
      </h3>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 text-[var(--text-color)]">
        {children}
      </div>
    </section>
  );
}

function composePanels(props: ExecBriefSheetProps): ExecBriefPanel[] {
  if (props.panels != null && props.panels.length > 0) {
    return [...props.panels];
  }

  const out: ExecBriefPanel[] = [];
  let n = 1;

  if (props.attentionRows != null && props.attentionRows.length > 0) {
    out.push({
      n,
      title: props.attentionTitle ?? 'Attention reweight',
      accent: 'warning',
      body: (
        <ExecBriefAttentionTable
          rows={props.attentionRows}
          max={props.attentionMax}
          caption={props.attentionCaption}
          beforeLabel={props.attentionBeforeLabel}
          afterLabel={props.attentionAfterLabel}
          deltaLabel={props.attentionDeltaLabel}
        />
      ),
      takeaway: props.attentionTakeaway,
    });
    n += 1;
  }

  const hasDo = props.doItems != null && props.doItems.length > 0;
  const hasDont = props.dontItems != null && props.dontItems.length > 0;
  if (hasDo || hasDont) {
    out.push({
      n,
      title:
        hasDo && hasDont
          ? `${props.doTitle ?? 'Do'} · ${props.dontTitle ?? "Don't"}`
          : hasDo
            ? (props.doTitle ?? 'Do')
            : (props.dontTitle ?? "Don't"),
      accent: 'success',
      body: (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {hasDo && (
            <div className="min-w-0">
              {hasDont && (
                <p className="m-0 mb-0.5 text-[0.52rem] font-bold uppercase tracking-wide text-[var(--color-success)]">
                  {props.doTitle ?? 'Do'}
                </p>
              )}
              <ul className="m-0 list-none space-y-0.5 p-0">
                {props.doItems!.map((item, i) => (
                  <ExecBriefListItem key={i} ok>
                    {item}
                  </ExecBriefListItem>
                ))}
              </ul>
            </div>
          )}
          {hasDont && (
            <div className="min-w-0">
              {hasDo && (
                <p className="m-0 mb-0.5 text-[0.52rem] font-bold uppercase tracking-wide text-[var(--color-danger)]">
                  {props.dontTitle ?? "Don't"}
                </p>
              )}
              <ul className="m-0 list-none space-y-0.5 p-0">
                {props.dontItems!.map((item, i) => (
                  <ExecBriefListItem key={i} ok={false}>
                    {item}
                  </ExecBriefListItem>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    });
  }

  return out;
}

/**
 * Dense A4-proportion executive brief sheet.
 * - `responsive` (default): 2×2 on sm+, single column on phone (in-article).
 * - `sheet`: fixed desktop 2×2 layout — scale as a single graphic (full-screen).
 * Height follows content (no overflow clip of body). Host supplies all copy.
 */
export function ExecBriefSheet({
  layout = 'responsive',
  className,
  eyebrow,
  title,
  subtitle,
  meta,
  attentionRows,
  attentionTitle,
  attentionCaption,
  attentionTakeaway,
  attentionMax,
  attentionBeforeLabel,
  attentionAfterLabel,
  attentionDeltaLabel,
  doItems,
  dontItems,
  doTitle,
  dontTitle,
  panels,
  footer,
}: ExecBriefSheetProps) {
  const sheet = layout === 'sheet';
  const resolved = composePanels({
    attentionRows,
    attentionTitle,
    attentionCaption,
    attentionTakeaway,
    attentionMax,
    attentionBeforeLabel,
    attentionAfterLabel,
    attentionDeltaLabel,
    doItems,
    dontItems,
    doTitle,
    dontTitle,
    panels,
    title,
  });

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-[var(--radius-card)]',
        'border border-[var(--border-color)] bg-[var(--card-bg-color)] shadow-sm',
        sheet ? 'w-[42rem] max-w-none shrink-0' : 'max-w-[48rem]',
        className,
      )}
    >
      <header
        className={
          sheet
            ? 'shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-color)]/45 px-3 py-2.5'
            : 'shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-color)]/45 px-2.5 py-2 sm:px-3 sm:py-2.5'
        }
      >
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <h2
            className={
              sheet
                ? 'm-0 text-base font-bold tracking-tight text-[var(--strong-text-color)]'
                : 'm-0 text-[0.9rem] font-bold tracking-tight text-[var(--strong-text-color)] sm:text-base'
            }
          >
            {title}
          </h2>
          {meta != null ? meta : null}
          {eyebrow != null && (
            <span className="text-[0.58rem] font-medium uppercase tracking-wider text-[var(--secondary-text-color)]">
              {eyebrow}
            </span>
          )}
        </div>
        {subtitle != null && (
          <div
            className={
              sheet
                ? 'm-0 space-y-0.5 text-[0.72rem] leading-snug text-[var(--text-color)]'
                : 'm-0 space-y-0.5 text-[0.68rem] leading-snug text-[var(--text-color)] sm:text-[0.72rem]'
            }
          >
            {subtitle}
          </div>
        )}
      </header>

      {resolved.length > 0 && (
        <div
          className={
            sheet
              ? 'mt-0 grid grid-cols-2 gap-2 p-2.5'
              : 'mt-0 grid grid-cols-1 gap-2 p-2 sm:mt-0 sm:grid-cols-2 sm:gap-2 sm:p-2.5'
          }
        >
          {resolved.map((panel) => (
            <PanelShell
              key={`${panel.n}-${panel.title}`}
              n={panel.n}
              title={panel.title}
              accent={panel.accent}
            >
              {panel.body}
              {panel.takeaway != null && (
                <ExecBriefTakeaway>{panel.takeaway}</ExecBriefTakeaway>
              )}
            </PanelShell>
          ))}
        </div>
      )}

      {footer != null && (
        <footer
          className={
            sheet
              ? 'shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-color)]/40 px-2.5 py-2'
              : 'shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-color)]/40 px-2 py-1.5 sm:px-2.5 sm:py-2'
          }
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

export default ExecBriefSheet;
