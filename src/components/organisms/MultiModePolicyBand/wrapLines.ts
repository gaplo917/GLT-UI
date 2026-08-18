/** Conservative line budget for operating-chip detail (Tailwind --text-sm). */
export const OPERATING_DETAIL_MAX_CHARS = 22;

/** Word-wrap used by MultiModePolicyBand SVG labels. */
export function wrapLines(text: string, maxChars: number, maxLines = 3): string[] {
  const tokens =
    text.match(
      /\s+|[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}，。！？；：、（）「」『』]|[^\s\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}，。！？；：、（）「」『』]+/gu,
    ) ?? [];
  const lines: string[] = [];
  let cur = "";
  let pendingSpace = false;
  const displayWidth = (value: string) =>
    Array.from(value).reduce(
      (width, char) =>
        width +
        (/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}，。！？；：、（）「」『』]$/u.test(
          char,
        )
          ? 2
          : 1),
      0,
    );

  for (const token of tokens) {
    if (/^\s+$/u.test(token)) {
      pendingSpace = Boolean(cur);
      continue;
    }

    const separator = pendingSpace && cur ? " " : "";
    const next = `${cur}${separator}${token}`;
    if (displayWidth(next) > maxChars && cur) {
      lines.push(cur);
      cur = token;
    } else {
      cur = next;
    }
    pendingSpace = false;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}
