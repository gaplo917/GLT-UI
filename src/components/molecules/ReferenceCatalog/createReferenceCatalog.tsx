import { RefCite, type RefCiteItem } from "@/components/molecules/RefCite/RefCite.js";
import {
  formatReferenceDate,
  type ReferenceEntry,
} from "@/components/molecules/ReferenceItem/ReferenceItem.js";

export type { ReferenceEntry };

/** URL map + bibliography entries + preferred citation order. */
export type ReferenceCatalogData<K extends string = string> = {
  sources: Record<K, string>;
  entries: Record<K, ReferenceEntry>;
  appearanceOrder: readonly K[];
};

/**
 * Build topic-scoped citation helpers from a JSON catalog (sources, entries,
 * appearanceOrder). Standardizes `R`, `citeItems`, `REF_NUM`, bibliography keys.
 */
export function createReferenceCatalog<K extends string>(
  data: ReferenceCatalogData<K>,
) {
  const S = data.sources as Record<K, string>;
  const REFS = data.entries as Record<K, ReferenceEntry>;
  const appearanceOrder = data.appearanceOrder as readonly K[];

  const REF_KEYS: K[] = [
    ...appearanceOrder,
    ...(Object.keys(REFS) as K[]).filter((k) => !appearanceOrder.includes(k)),
  ];

  const REF_NUM = Object.fromEntries(
    REF_KEYS.map((k, i) => [k, i + 1]),
  ) as Record<K, number>;

  function isRefKey(k: string): k is K {
    return k in REF_NUM;
  }

  function toItems(keys: readonly string[]): RefCiteItem[] {
    return keys
      .filter(isRefKey)
      .sort((a, b) => REF_NUM[a] - REF_NUM[b])
      .map((k) => {
        const entry = REFS[k];
        return {
          n: REF_NUM[k],
          author: entry.author,
          date: entry.date,
          dateLabel: formatReferenceDate(entry.date),
          publisher: entry.publisher,
          title: entry.title,
          summary: entry.summary,
        };
      });
  }

  /** Compact scientific citation chips: [1] or [1][3]. */
  function R({ of: ofKeys }: { of: K | K[] | string | string[] }) {
    const keys = Array.isArray(ofKeys) ? ofKeys : [ofKeys];
    const items = toItems(keys);
    if (items.length === 0) return null;
    return <RefCite items={items} />;
  }

  function citeItems(...keys: (K | string)[]): RefCiteItem[] {
    return toItems(keys);
  }

  return {
    S,
    REFS,
    REF_KEYS,
    REF_NUM,
    R,
    citeItems,
    formatRefDate: formatReferenceDate,
  } as const;
}

export type ReferenceCatalog = ReturnType<typeof createReferenceCatalog>;
