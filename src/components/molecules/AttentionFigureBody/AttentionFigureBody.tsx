import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/organisms/Table/Table.js";
import { Text } from "@/components/atoms/Text/Text.js";
import type { ChartColorToken } from "@/components/organisms/Chart/Chart.js";

export type AttentionFigureSlice = {
  key: string;
  label: string;
  why: string;
  before: number;
  after: number;
  color: ChartColorToken;
  /** Optional citation marker(s) rendered after `why` (e.g. `<RefCite />`). */
  cite?: ReactNode;
};

export type AttentionFigureUiLabels = {
  costBucket: string;
  before: string;
  after: string;
  delta: string;
};

/**
 * Mobile cards + desktop table under AttentionShiftBars.
 * All copy and cite nodes are props — no hidden content catalogs.
 */
export function AttentionFigureBody({
  slices,
  ui,
}: {
  slices: readonly AttentionFigureSlice[];
  ui: AttentionFigureUiLabels;
}) {
  return (
    <>
      <ul className="mt-6 m-0 flex list-none flex-col gap-3 p-0 md:hidden">
        {slices.map((c) => {
          const delta = c.after - c.before;
          return (
            <li
              key={c.key}
              className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-color)]/40 px-3.5 py-3"
            >
              <Text as="div" weight="medium" className="leading-snug">
                {c.label}
              </Text>
              <Text
                as="div"
                size="sm"
                tone="secondary"
                className="mt-1 mb-3 leading-snug"
              >
                {c.why}
                {c.cite}
              </Text>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Text
                    as="div"
                    size="xs"
                    tone="secondary"
                    className="font-mono uppercase tracking-wide"
                  >
                    {ui.before}
                  </Text>
                  <Text as="div" weight="semibold" className="mt-0.5">
                    {c.before}%
                  </Text>
                </div>
                <div>
                  <Text
                    as="div"
                    size="xs"
                    tone="secondary"
                    className="font-mono uppercase tracking-wide"
                  >
                    {ui.after}
                  </Text>
                  <Text as="div" weight="semibold" className="mt-0.5">
                    {c.after}%
                  </Text>
                </div>
                <div>
                  <Text
                    as="div"
                    size="xs"
                    tone="secondary"
                    className="font-mono uppercase tracking-wide"
                  >
                    {ui.delta}
                  </Text>
                  <Text
                    as="div"
                    weight="semibold"
                    className="mt-0.5"
                    tone={delta > 0 ? "danger" : "success"}
                  >
                    {delta > 0 ? `+${delta}` : delta} pp
                  </Text>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 hidden overflow-x-auto md:block">
        <Table striped compact hoverable className="min-w-[36rem]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>{ui.costBucket}</TableHeaderCell>
              <TableHeaderCell align="right">{ui.before}</TableHeaderCell>
              <TableHeaderCell align="right">{ui.after}</TableHeaderCell>
              <TableHeaderCell align="right">{ui.delta}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slices.map((c) => {
              const delta = c.after - c.before;
              return (
                <TableRow key={c.key}>
                  <TableCell>
                    <Text as="div" weight="medium">
                      {c.label}
                    </Text>
                    <Text
                      as="div"
                      size="sm"
                      tone="secondary"
                      className="mt-1 leading-snug"
                    >
                      {c.why}
                      {c.cite}
                    </Text>
                  </TableCell>
                  <TableCell align="right">{c.before}%</TableCell>
                  <TableCell align="right">{c.after}%</TableCell>
                  <TableCell align="right">
                    <Text
                      as="span"
                      tone={delta > 0 ? "danger" : "success"}
                      weight="semibold"
                    >
                      {delta > 0 ? `+${delta}` : delta} pp
                    </Text>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default AttentionFigureBody;
