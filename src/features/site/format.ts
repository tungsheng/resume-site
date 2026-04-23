export function formatDurationLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) return `${minutes}m`;
  return `${minutes}m ${remainder}s`;
}

export function formatTimelineSeconds(seconds: number): string {
  return `${seconds}s`;
}

export function formatCurrencyLabel(value: number): string {
  if (value === 0) return "$0.00";
  return `$${value.toFixed(3)}`;
}

export function formatBurstTtftLabel(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  return formatDurationLabel(Math.round(seconds));
}
