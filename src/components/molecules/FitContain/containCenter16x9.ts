/** Axis-aligned box returned by {@link containCenter16x9}. */
export type ContainCenterBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const PRESENT_ASPECT_W = 16;
export const PRESENT_ASPECT_H = 9;

/**
 * Contain-fit a 16:9 stage into a viewport and center it.
 * Same math present mode uses for the full-screen presentation frame.
 */
export function containCenter16x9(vw: number, vh: number): ContainCenterBox {
  if (!(vw > 0) || !(vh > 0)) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const aspect = PRESENT_ASPECT_W / PRESENT_ASPECT_H;
  let width: number;
  let height: number;
  if (vw / vh >= aspect) {
    height = vh;
    width = vh * aspect;
  } else {
    width = vw;
    height = vw / aspect;
  }
  return {
    width,
    height,
    x: (vw - width) / 2,
    y: (vh - height) / 2,
  };
}
