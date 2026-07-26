import type { ReactNode } from "react";
import { Cite } from "@/components/molecules/Cite/Cite.js";
import { FigureDataTableToggle } from "@/components/molecules/Figure/FigureDataTableToggle.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/organisms/Table/Table.js";
import { Text } from "@/components/atoms/Text/Text.js";

export type ResolveRateFigurePoint = {
  period: string;
  model: string;
  resolveRate: number;
  /** Absolute URL for the model / score source. */
  source: string;
  note: string;
  /** Optional citation marker(s) after the note. */
  cite?: ReactNode;
};

export type ResolveRateFigureUiLabels = {
  dataTableSources: string;
  dataTableHint: string;
  show: string;
  hide: string;
  quarter: string;
  model: string;
  resolvePct: string;
  source: string;
};

/**
 * Expandable mobile cards + desktop table under ResolveRateTrend.
 * Points and labels are props; cite nodes are supplied by the host.
 */
export function ResolveRateFigureBody({
  points,
  ui,
}: {
  points: readonly ResolveRateFigurePoint[];
  ui: ResolveRateFigureUiLabels;
}) {
  return (
    <FigureDataTableToggle
      label={ui.dataTableSources}
      hint={ui.dataTableHint}
      showLabel={ui.show}
      hideLabel={ui.hide}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0 md:hidden">
        {points.map((r) => (
          <li
            key={`${r.period}-${r.model}`}
            className="flex items-start justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--border-color)] px-3 py-2.5"
          >
            <div className="min-w-0">
              <Text as="div" size="sm" tone="secondary" className="font-mono">
                {r.period}
              </Text>
              <Cite href={r.source}>{r.model}</Cite>
              <Text as="div" size="sm" tone="secondary" className="mt-0.5">
                {r.note}
                {r.cite}
              </Text>
            </div>
            <Text as="div" weight="semibold" className="shrink-0 tabular-nums">
              {r.resolveRate}%
            </Text>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <Table striped compact hoverable className="min-w-[32rem]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>{ui.quarter}</TableHeaderCell>
              <TableHeaderCell>{ui.model}</TableHeaderCell>
              <TableHeaderCell align="right">{ui.resolvePct}</TableHeaderCell>
              <TableHeaderCell>{ui.source}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {points.map((r) => (
              <TableRow key={`${r.period}-${r.model}`}>
                <TableCell>{r.period}</TableCell>
                <TableCell>
                  <Cite href={r.source}>{r.model}</Cite>
                </TableCell>
                <TableCell align="right">{r.resolveRate}%</TableCell>
                <TableCell>
                  <Text size="sm" tone="secondary">
                    {r.note}
                    {r.cite}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FigureDataTableToggle>
  );
}

export default ResolveRateFigureBody;
