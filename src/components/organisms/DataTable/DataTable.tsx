import * as React from 'react';
import { cn } from '@/lib/cn.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/organisms/Table/Table.js';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
  highlight?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Draw a border around every cell. */
  bordered?: boolean;
  /** Remove borders and row dividers. */
  borderless?: boolean;
  /** Zebra-stripe body rows. */
  striped?: boolean;
  /** Highlight body rows on hover. */
  hoverable?: boolean;
  /** Tighter cell padding. */
  compact?: boolean;
  /** Shade the header row. Defaults to true. */
  headed?: boolean;
  className?: string;
}

/**
 * A typed, column-driven table built on the composable `Table` organism. Each
 * column's `align` is applied to BOTH its header and its body cells, so headers
 * and content always line up. Pass `bordered`, `borderless`, `striped`,
 * `hoverable`, or `compact` for different table styles.
 */
export function DataTable<T>({
  columns,
  rows,
  bordered,
  borderless,
  striped,
  hoverable,
  compact,
  headed = true,
  className,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <Table
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        hoverable={hoverable}
        compact={compact}
        className={className}
      >
        <TableHead className={cn(headed && 'bg-[var(--card-bg-color)]')}>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={String(col.key)} align={col.align}>
                {col.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => {
                const cell = col.render
                  ? col.render(row)
                  : String((row as Record<string, unknown>)[col.key as string] ?? '');
                return (
                  <TableCell
                    key={String(col.key)}
                    align={col.align}
                    className={col.highlight ? 'font-medium text-[var(--brand-primary)]' : undefined}
                  >
                    {cell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
