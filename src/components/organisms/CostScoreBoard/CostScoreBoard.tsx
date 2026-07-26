"use client";

import { Checkbox } from "@/components/atoms/Checkbox/Checkbox.js";
import { Text } from "@/components/atoms/Text/Text.js";
import { FigureDataTableToggle } from "@/components/molecules/Figure/FigureDataTableToggle.js";
import { RefCite, type RefCiteItem } from "@/components/molecules/RefCite/RefCite.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/organisms/Table/Table.js";
import { CostScoreScatter } from "@/components/organisms/CostScoreScatter/CostScoreScatter.js";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type CostScoreBenchmarkId = string;

export type CostScoreFigureRow = {
  model: string;
  chartLabel: string;
  effort: string;
  harness: string;
  /** Which public leaderboard this row comes from. */
  benchmark: CostScoreBenchmarkId;
  /** Human label for the benchmark (table + filter). */
  benchmarkLabel: string;
  /** Tasks in the suite (500 Verified, 113 DeepSWE). */
  taskCount: number;
  resolveRate: number;
  /** Avg $ per task; null when the leaderboard has not published cost. */
  costPerTest: number | null;
  totalCost: number | null;
  inputPerM: number | null;
  outputPerM: number | null;
  color: string;
  scoreSource: string;
  priceSource: string;
};

type ModelOption = {
  model: string;
  color: string;
  count: number;
};

type BenchmarkOption = {
  id: CostScoreBenchmarkId;
  label: string;
  taskCount: number;
};

function uniqueModels(points: readonly CostScoreFigureRow[]): ModelOption[] {
  const map = new Map<string, ModelOption>();
  for (const p of points) {
    const existing = map.get(p.model);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(p.model, { model: p.model, color: p.color, count: 1 });
    }
  }
  // Alphabetical by model name (stable filter chips)
  return [...map.values()].sort((a, b) =>
    a.model.localeCompare(b.model, undefined, { sensitivity: "base" }),
  );
}

function uniqueBenchmarks(
  points: readonly CostScoreFigureRow[],
): BenchmarkOption[] {
  const map = new Map<CostScoreBenchmarkId, BenchmarkOption>();
  for (const p of points) {
    if (!map.has(p.benchmark)) {
      map.set(p.benchmark, {
        id: p.benchmark,
        label: p.benchmarkLabel,
        taskCount: p.taskCount,
      });
    }
  }
  // Preserve first-seen order from points
  return [...map.values()];
}

function rowKey(row: CostScoreFigureRow) {
  return `${row.benchmark}-${row.chartLabel}-${row.harness}`;
}

export function CostScoreBoard({
  points,
  suiteCites,
  compact = false,
  chartHeight,
  dataTableLabel = "Data table and sources",
}: {
  points: readonly CostScoreFigureRow[];
  /** Bibliography markers keyed by board id (serializable for RSC → client). */
  suiteCites?: Partial<Record<CostScoreBenchmarkId, readonly RefCiteItem[]>>;
  /** Presentation deck: hide data table, denser chrome. */
  compact?: boolean;
  /** Override scatter height (presentation slide fill). */
  chartHeight?: number;
  /** Collapsible table toggle label (locale-driven from the host). */
  dataTableLabel?: string;
}) {
  const benchmarks = useMemo(() => uniqueBenchmarks(points), [points]);
  const defaultBench = benchmarks[0]?.id ?? "default";
  const [benchmark, setBenchmark] =
    useState<CostScoreBenchmarkId>(defaultBench);

  const benchPoints = useMemo(
    () => points.filter((p) => p.benchmark === benchmark),
    [points, benchmark],
  );

  const models = useMemo(() => uniqueModels(benchPoints), [benchPoints]);
  const allModelNames = useMemo(() => models.map((m) => m.model), [models]);
  const modelKey = useMemo(() => allModelNames.join("|"), [allModelNames]);
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(allModelNames),
  );

  // When switching benchmark, show every model on that board
  useEffect(() => {
    setVisible(new Set(allModelNames));
  }, [benchmark, modelKey, allModelNames]);

  const filtered = useMemo(
    () => benchPoints.filter((p) => visible.has(p.model)),
    [benchPoints, visible],
  );

  const activeBench = benchmarks.find((b) => b.id === benchmark);
  const selectedModelCount = models.filter((m) => visible.has(m.model)).length;

  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const modelListId = useId();

  useEffect(() => {
    if (!modelMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(e.target as Node)
      ) {
        setModelMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModelMenuOpen(false);
        modelTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [modelMenuOpen]);

  function toggle(model: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(model)) next.delete(model);
      else next.add(model);
      return next;
    });
  }

  function selectAllModels() {
    setVisible(new Set(allModelNames));
  }

  function clearAllModels() {
    setVisible(new Set());
  }

  const xAxisLabel = `Total suite cost ($ · ${activeBench?.taskCount ?? "—"} tasks)`;
  const yAxisLabel = activeBench
    ? `${activeBench.label} (%)`
    : "Score (%)";

  // Fixed rem sizes only — never % / vw / vh (presentation slides are CSS-scaled).
  const modelFilter = (
    <div
      ref={modelMenuRef}
      className="relative flex min-w-0 flex-wrap items-center gap-2"
    >
      <Text
        size="sm"
        weight="semibold"
        className="inline-flex h-8 shrink-0 items-center tracking-tight"
      >
        Filter:
      </Text>
      <div className="relative w-max max-w-[14rem] shrink-0">
        <button
          ref={modelTriggerRef}
          type="button"
          data-testid="cost-score-model-filter"
          aria-haspopup="listbox"
          aria-expanded={modelMenuOpen}
          aria-controls={modelListId}
          onClick={(e) => {
            e.stopPropagation();
            setModelMenuOpen((o) => !o);
          }}
          className={[
            "inline-flex h-8 w-max max-w-[14rem] shrink-0 items-center gap-1.5 rounded-full border px-3 py-0 text-left text-sm leading-none transition-colors",
            "border-[var(--border-color)] bg-[var(--card-bg-color)] text-[var(--strong-text-color)] shadow-sm",
            "hover:border-[var(--brand-primary)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]",
            modelMenuOpen ? "border-[var(--brand-primary)]" : "",
          ].join(" ")}
        >
          <span className="whitespace-nowrap font-medium">
            {selectedModelCount === models.length
              ? "All models"
              : selectedModelCount === 0
                ? "No models"
                : `${selectedModelCount} of ${models.length} models`}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            width={12}
            height={12}
            fill="none"
            className={[
              "shrink-0 text-[var(--secondary-text-color)] transition-transform duration-200",
              modelMenuOpen ? "rotate-180" : "",
            ].join(" ")}
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {modelMenuOpen ? (
          <div
            id={modelListId}
            role="listbox"
            aria-multiselectable="true"
            aria-label="Filter models on figure"
            className={[
              "absolute left-0 top-full z-30 mt-1 flex w-52 flex-col overflow-hidden",
              "rounded-md border border-[var(--border-color)] bg-[var(--card-bg-color)] shadow-lg",
              "max-h-52",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-color)] px-2.5 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--secondary-text-color)]">
                Show models
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={selectAllModels}
                  className="text-[10px] font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline"
                >
                  All
                </button>
                <span className="text-[var(--border-color)]" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  onClick={clearAllModels}
                  className="text-[10px] font-medium text-[var(--secondary-text-color)] underline-offset-2 hover:underline"
                >
                  None
                </button>
              </div>
            </div>
            <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-1 [scrollbar-width:thin]">
              {models.map((m) => {
                const on = visible.has(m.model);
                const cid = `${modelListId}-${m.model.replace(/\s+/g, "-")}`;
                return (
                  <li key={m.model} className="m-0">
                    <label
                      htmlFor={cid}
                      className={[
                        "flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[11px] leading-snug",
                        "hover:bg-[var(--bg-color)]/70",
                        on
                          ? "text-[var(--strong-text-color)]"
                          : "text-[var(--secondary-text-color)]",
                      ].join(" ")}
                    >
                      <Checkbox
                        id={cid}
                        checked={on}
                        onChange={() => toggle(m.model)}
                        aria-label={m.model}
                        className="!h-3.5 !w-3.5 shrink-0"
                      />
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: m.color,
                          opacity: on ? 1 : 0.4,
                        }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {m.model}
                      </span>
                      {m.count > 1 ? (
                        <span className="shrink-0 text-[10px] opacity-60">
                          ×{m.count}
                        </span>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );

  const toolbar = (
    <div
      className={[
        "relative z-20 flex min-w-0 shrink-0 flex-col gap-2",
        compact ? "px-0.5" : "",
      ].join(" ")}
    >
      {benchmarks.length > 1 ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          <Text
            size="sm"
            weight="semibold"
            className="inline-flex h-8 shrink-0 items-center tracking-tight"
          >
            Benchmark Type:
          </Text>
          <div
            className="flex min-w-0 flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Select benchmark type"
          >
            {benchmarks.map((b) => {
              const on = benchmark === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBenchmark(b.id)}
                  aria-pressed={on}
                  className={[
                    "inline-flex h-8 max-w-full items-center gap-1.5 rounded-full border px-2.5 text-left text-xs transition-colors sm:gap-2 sm:px-3 sm:text-sm",
                    on
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--text-color)] shadow-sm"
                      : "border-[var(--border-color)] bg-transparent text-[var(--text-secondary-color,var(--text-color))]",
                  ].join(" ")}
                >
                  <span className="font-medium leading-none">{b.label}</span>
                  <span className="text-[10px] opacity-70 sm:text-xs">
                    {b.taskCount} tasks
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* Filter row sits under Benchmark */}
      {modelFilter}
    </div>
  );

  return (
    <div
      className={[
        "min-w-0",
        compact ? "flex h-full min-h-0 flex-col gap-1.5" : "space-y-5",
      ].join(" ")}
    >
      {/* Toolbar: benchmark pills + Models dropdown on one row */}
      <div
        className={[
          "min-w-0",
          compact ? "flex min-h-0 flex-1 flex-col gap-1.5" : "flex flex-col gap-2",
        ].join(" ")}
      >
        {toolbar}

        <div
          className={[
            "relative min-w-0",
            compact ? "min-h-0 flex-1" : "",
          ].join(" ")}
        >
          {filtered.length > 0 ? (
            <div className={compact ? "h-full min-h-0 min-w-0" : undefined}>
              <CostScoreScatter
                points={filtered}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                height={chartHeight}
                fill={compact}
              />
            </div>
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)]">
              <Text size="sm" tone="secondary">
                No models selected.
              </Text>
            </div>
          )}
        </div>
      </div>

      {compact ? null : (
      <FigureDataTableToggle label={dataTableLabel}>
        {/* Phone: compact cards — full metrics without clipping headers */}
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 md:hidden">
          {filtered.length === 0 ? (
            <li className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)] px-3 py-4 text-center">
              <Text size="sm" tone="secondary">
                No rows. Select at least one model above.
              </Text>
            </li>
          ) : (
            filtered.map((row) => (
              <li
                key={rowKey(row)}
                className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-color)]/40 px-3 py-2.5"
              >
                <span className="font-medium">
                  <a
                    href={row.scoreSource}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 text-[var(--brand-primary)]"
                  >
                    {row.chartLabel}
                  </a>
                  {suiteCites?.[row.benchmark] ? (
                    <RefCite items={suiteCites[row.benchmark]!} />
                  ) : null}
                </span>
                <Text as="div" size="sm" tone="secondary" className="mt-0.5">
                  <code>{row.effort}</code>
                  {" · "}
                  {row.harness}
                  {" · "}
                  {row.benchmarkLabel}
                </Text>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <Text
                      as="div"
                      size="xs"
                      tone="secondary"
                      className="font-mono uppercase tracking-wide"
                    >
                      Score
                    </Text>
                    <Text as="div" weight="semibold" className="mt-0.5">
                      {row.resolveRate}%
                    </Text>
                  </div>
                  <div>
                    <Text
                      as="div"
                      size="xs"
                      tone="secondary"
                      className="font-mono uppercase tracking-wide"
                    >
                      $/task
                    </Text>
                    <Text as="div" weight="semibold" className="mt-0.5">
                      {row.costPerTest != null
                        ? `$${row.costPerTest.toFixed(2)}`
                        : "—"}
                    </Text>
                  </div>
                  <div>
                    <Text
                      as="div"
                      size="xs"
                      tone="secondary"
                      className="font-mono uppercase tracking-wide"
                    >
                      Suite $
                    </Text>
                    <Text as="div" weight="semibold" className="mt-0.5">
                      {row.totalCost != null
                        ? `$${row.totalCost.toFixed(0)}`
                        : "—"}
                    </Text>
                  </div>
                </div>
                {row.inputPerM != null && row.outputPerM != null ? (
                  <Text as="div" size="sm" tone="secondary" className="mt-2">
                    List{" "}
                    <a
                      href={row.priceSource}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 text-[var(--brand-primary)]"
                    >
                      ${row.inputPerM}/${row.outputPerM}
                    </a>{" "}
                    in/out per MTok
                  </Text>
                ) : null}
              </li>
            ))
          )}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <Table striped compact hoverable className="min-w-[48rem]">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Model</TableHeaderCell>
                <TableHeaderCell>Effort</TableHeaderCell>
                <TableHeaderCell>Harness</TableHeaderCell>
                <TableHeaderCell align="right">Score %</TableHeaderCell>
                <TableHeaderCell align="right">$/task</TableHeaderCell>
                <TableHeaderCell align="right">
                  Suite total ($ · {activeBench?.taskCount ?? "—"})
                </TableHeaderCell>
                <TableHeaderCell align="right">
                  List price in/out
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Text size="sm" tone="secondary">
                      No rows. Select at least one model above.
                    </Text>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={rowKey(row)}>
                    <TableCell>
                      <a
                        href={row.scoreSource}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 text-[var(--brand-primary)]"
                      >
                        {row.chartLabel}
                      </a>
                      {suiteCites?.[row.benchmark] ? (
                        <RefCite items={suiteCites[row.benchmark]!} />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <code>{row.effort}</code>
                    </TableCell>
                    <TableCell>
                      <Text size="sm" tone="secondary">
                        {row.harness}
                      </Text>
                    </TableCell>
                    <TableCell align="right">{row.resolveRate}%</TableCell>
                    <TableCell align="right">
                      {row.costPerTest != null
                        ? `$${row.costPerTest.toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      {row.totalCost != null
                        ? `$${row.totalCost.toFixed(0)}`
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      {row.inputPerM != null && row.outputPerM != null ? (
                        <a
                          href={row.priceSource}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 text-[var(--brand-primary)]"
                        >
                          ${row.inputPerM}/${row.outputPerM}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </FigureDataTableToggle>
      )}
    </div>
  );
}
