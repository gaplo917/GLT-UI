import type * as React from 'react';

/** A single labeled example: a live preview paired with its source snippet. */
export interface DocExample {
  /** Short title for the example (e.g. "Variants", "Sizes", "Dismissible"). */
  title: string;
  /** Optional one-line explanation of what the example shows. */
  description?: string;
  /** Source code shown in the CodeBlock (TSX). */
  code: string;
  /** Live rendered preview of the same code. */
  render: React.ReactNode;
  /** Language for the code block. Defaults to "tsx". */
  lang?: string;
  /** Constrain the preview surface width (utility class), e.g. "max-w-md". */
  previewClassName?: string;
}

/** One row of a component's Props API table. */
export interface DocProp {
  /** Prop name (e.g. "variant", "size"). Use "…rest" for spread HTML attrs. */
  name: string;
  /** TypeScript type, shown verbatim (e.g. "'sm' | 'md' | 'lg'"). */
  type: string;
  /** Default value if the prop is optional and has one (e.g. "'md'"). */
  default?: string;
  /** Whether the prop is required. */
  required?: boolean;
  /** One-line description of the prop. */
  description: string;
}

/** A named Props API table — a component may expose several (e.g. a family). */
export interface DocPropsTable {
  /** Heading for the table (defaults to the component name when omitted). */
  title?: string;
  props: DocProp[];
}

/** Documentation for one component (or closely-related component family). */
export interface DocEntry {
  /** URL-safe slug used for hash routing and the sidebar. */
  id: string;
  /** Display name (e.g. "Button", "Card"). */
  name: string;
  /** One or two sentence summary of the component's purpose. */
  description: string;
  /** Import statement shown at the top of the entry. */
  importLine?: string;
  /** Labeled usage examples. */
  examples?: DocExample[];
  /** Props API tables (one per exported component in the family). */
  propsTables?: DocPropsTable[];
  /**
   * Full-bleed custom content rendered instead of the examples grid — used by
   * the use-case-driven "Practical Demos" section.
   */
  custom?: React.ReactNode;
}

/** A left-nav group of related entries. */
export interface DocSection {
  id: string;
  title: string;
  /** Short blurb shown under the section title in the sidebar/overview. */
  blurb?: string;
  entries: DocEntry[];
}
