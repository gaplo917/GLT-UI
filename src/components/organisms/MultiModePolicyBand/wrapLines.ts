/** Conservative line budget for operating-chip detail (11px type, ~211px chip). */
export const OPERATING_DETAIL_MAX_CHARS = 22;

/** Word-wrap used by MultiModePolicyBand SVG labels. */
export function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
