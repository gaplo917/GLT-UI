import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type TableAlign = 'left' | 'center' | 'right';
export type TableVAlign = 'top' | 'middle' | 'bottom';

const alignClass: Record<TableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const vAlignClass: Record<TableVAlign, string> = {
  top: 'align-top',
  middle: 'align-middle',
  bottom: 'align-bottom',
};

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Draw a border around every cell. */
  bordered?: boolean;
  /** Remove all borders and row dividers (overrides the default row dividers). */
  borderless?: boolean;
  /** Zebra-stripe body rows. */
  striped?: boolean;
  /** Highlight body rows on hover. */
  hoverable?: boolean;
  /** Tighter cell padding. */
  compact?: boolean;
  /** Stretch to the container width. Defaults to true. */
  fullWidth?: boolean;
}

/**
 * A generic, composable HTML table. Assemble it from `TableHead` / `TableBody` /
 * `TableFoot`, `TableRow`, `TableHeaderCell`, and `TableCell`. Cell padding,
 * borders, striping, and hover are driven by props on `Table` (applied to the
 * child cells/rows), so the sub-parts stay declarative. Per-cell alignment lives
 * on `TableHeaderCell` / `TableCell` via `align`, keeping headers and body cells
 * in lockstep.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    { bordered = false, borderless = false, striped = false, hoverable = false, compact = false, fullWidth = true, className, ...props },
    ref
  ) => {
    const padding = compact
      ? '[&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5'
      : '[&_th]:px-4 [&_th]:py-2.5 [&_td]:px-4 [&_td]:py-2.5';

    const borders = bordered
      ? 'border border-[var(--border-color)] [&_th]:border [&_th]:border-[var(--border-color)] [&_td]:border [&_td]:border-[var(--border-color)]'
      : borderless
        ? ''
        : '[&_thead_tr]:border-b [&_thead_tr]:border-[var(--border-color)] [&_tbody_tr:not(:last-child)]:border-b [&_tbody_tr:not(:last-child)]:border-[var(--border-color)]';

    return (
      <table
        ref={ref}
        className={cn(
          'border-collapse text-base text-[var(--text-color)]',
          '[&_th]:font-semibold [&_th]:text-[var(--strong-text-color)]',
          fullWidth ? 'w-full' : 'w-auto',
          padding,
          borders,
          striped && '[&_tbody_tr:nth-child(even)]:bg-[var(--card-bg-color)]',
          hoverable && '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-[var(--border-color)]/30',
          className
        )}
        {...props}
      />
    );
  }
);
Table.displayName = 'Table';

/** An accessible caption/title rendered above the table body. */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('px-4 py-2 text-left text-base text-[var(--secondary-text-color)]', className)}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';

/** The table's header group. */
export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={className} {...props} />
);
TableHead.displayName = 'TableHead';

/** The table's body group. */
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={className} {...props} />
);
TableBody.displayName = 'TableBody';

/** The table's footer group. */
export const TableFoot = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={className} {...props} />
);
TableFoot.displayName = 'TableFoot';

/** A table row. */
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr ref={ref} className={className} {...props} />
);
TableRow.displayName = 'TableRow';

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Horizontal alignment; keep this identical to the matching TableCell. */
  align?: TableAlign;
  /** Vertical alignment within the cell. Defaults to `middle`. */
  valign?: TableVAlign;
}

/** A header cell (`<th>`). */
export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = 'left', valign = 'middle', className, ...props }, ref) => (
    <th ref={ref} scope="col" className={cn(alignClass[align], vAlignClass[valign], className)} {...props} />
  )
);
TableHeaderCell.displayName = 'TableHeaderCell';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Horizontal alignment; keep this identical to the matching TableHeaderCell. */
  align?: TableAlign;
  /** Vertical alignment within the cell. Defaults to `middle`; use `top` for image or long-paragraph rows. */
  valign?: TableVAlign;
}

/** A body cell (`<td>`). */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', valign = 'middle', className, ...props }, ref) => (
    <td ref={ref} className={cn(alignClass[align], vAlignClass[valign], className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

export default Table;
