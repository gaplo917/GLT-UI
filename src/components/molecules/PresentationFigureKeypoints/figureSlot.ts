/** True when the figure should occupy the whole board body (no restating keypoints). */
export function shouldFillFigureSlot(
  bullets?: readonly unknown[],
  callout?: unknown,
): boolean {
  const hasBullets = Array.isArray(bullets) && bullets.length > 0;
  return !hasBullets && callout == null;
}
