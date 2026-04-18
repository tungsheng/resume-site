const LETTER_WIDTH_PX = 8.5 * 96;
const MIN_PREVIEW_SCALE = 0.42;
const MAX_PREVIEW_SCALE = 1.4;
const DESKTOP_CONTROL_RESERVE = 92;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateResumePreviewScale(viewportWidth: number): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return 1;

  const preferredRatio =
    viewportWidth < 640 ? 0.92 : viewportWidth < 1024 ? 0.82 : 0.72;
  const horizontalPadding = viewportWidth < 720 ? 32 : 56;
  const sideControlReserve = viewportWidth < 720 ? 0 : DESKTOP_CONTROL_RESERVE;
  const availableWidth = Math.max(viewportWidth - horizontalPadding - sideControlReserve, 280);
  const preferredWidth = Math.min(availableWidth, viewportWidth * preferredRatio);
  const scale = preferredWidth / LETTER_WIDTH_PX;

  return clamp(scale, MIN_PREVIEW_SCALE, MAX_PREVIEW_SCALE);
}
