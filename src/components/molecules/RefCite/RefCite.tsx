"use client";

import { Tooltip } from "@/components/atoms/Tooltip/Tooltip.js";
import type { RefCiteItem } from "./refCiteTypes.js";

export type { RefCiteItem } from "./refCiteTypes.js";

/**
 * Compact [n] markers with hover preview. Client-only so the tooltip can portal.
 * Use in HTML body, captions, tables — not inside SVG (use `SvgRefCite` there).
 */
export function RefCite({ items }: { items: readonly RefCiteItem[] }) {
  if (items.length === 0) return null;
  return (
    <sup className="ml-0.5 whitespace-nowrap text-[0.72em] font-semibold leading-none tracking-tight text-[var(--brand-primary)]">
      {items.map((entry) => (
        <Tooltip
          key={entry.n}
          side="top"
          className="inline align-super"
          content={
            <span className="block max-w-[18rem] space-y-1 text-left normal-case tracking-normal">
              <span className="block font-semibold">
                [{entry.n}] {entry.author}
              </span>
              <span className="block opacity-90">
                <time dateTime={entry.date}>{entry.dateLabel}</time>
                {" · "}
                {entry.publisher}
              </span>
              <span className="block italic leading-snug">
                “{entry.title}”
              </span>
              <span className="block leading-snug opacity-90">
                {entry.summary}
              </span>
            </span>
          }
        >
          <a href={`#ref-${entry.n}`} className="ref-cite">
            [{entry.n}]
          </a>
        </Tooltip>
      ))}
    </sup>
  );
}
