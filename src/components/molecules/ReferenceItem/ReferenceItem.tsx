import { Text } from "@/components/atoms/Text/Text.js";

export type ReferenceEntry = {
  author: string;
  title: string;
  publisher: string;
  /** ISO date (YYYY-MM-DD), month (YYYY-MM), or year (YYYY). */
  date: string;
  summary: string;
};

export function formatReferenceDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (parts.length >= 3 && parts[2]) {
    return `${parts[2]} ${months[parts[1] - 1]} ${parts[0]}`;
  }
  if (parts.length >= 2 && parts[1]) {
    return `${months[parts[1] - 1]} ${parts[0]}`;
  }
  return String(parts[0] ?? iso);
}

/**
 * Wikipedia-style bibliography row: `n. Author (date). “Title”. Publisher. Summary.`
 */
export function ReferenceItem({
  n,
  href,
  entry,
  dateLabel,
}: {
  n: number;
  href: string;
  entry: ReferenceEntry;
  /** Optional preformatted date; defaults to formatReferenceDate(entry.date). */
  dateLabel?: string;
}) {
  const label = dateLabel ?? formatReferenceDate(entry.date);
  return (
    <li
      id={`ref-${n}`}
      className="scroll-mt-24 grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-x-3.5 py-1.5"
    >
      <span
        className="pt-px text-right font-medium tabular-nums tracking-tight text-[var(--secondary-text-color)]"
        aria-hidden
      >
        {n}.
      </span>
      <Text as="div" size="sm" className="min-w-0 leading-relaxed">
        <span className="font-medium">{entry.author}</span>
        {" ("}
        <time dateTime={entry.date}>{label}</time>
        {"). "}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--brand-primary)] underline underline-offset-2"
        >
          “{entry.title}”
        </a>
        {". "}
        <span className="text-[var(--text-secondary-color,var(--text-color))]">
          {entry.publisher}
        </span>
        {". "}
        <span>{entry.summary}</span>
      </Text>
    </li>
  );
}

export default ReferenceItem;
