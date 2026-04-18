import type { ExperimentProfile } from "./types";

export interface ExperimentComparisonRow {
  label: string;
  zeroIdle: string;
  warmOne: string;
}

function getProfile(
  profiles: ExperimentProfile[],
  id: ExperimentProfile["id"]
): ExperimentProfile {
  const match = profiles.find((profile) => profile.id === id);
  if (!match) {
    throw new Error(`Missing experiment profile: ${id}`);
  }
  return match;
}

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

export function buildExperimentComparisonRows(
  profiles: ExperimentProfile[]
): ExperimentComparisonRow[] {
  const zeroIdle = getProfile(profiles, "zero-idle");
  const warmOne = getProfile(profiles, "warm-1");

  return [
    {
      label: "Baseline GPU state",
      zeroIdle: zeroIdle.baselineGpuState,
      warmOne: warmOne.baselineGpuState,
    },
    {
      label: "First ready replica",
      zeroIdle: formatDurationLabel(zeroIdle.firstReadySeconds),
      warmOne: formatDurationLabel(warmOne.firstReadySeconds),
    },
    {
      label: "First public response",
      zeroIdle: formatDurationLabel(zeroIdle.firstPublicResponseSeconds),
      warmOne: formatDurationLabel(warmOne.firstPublicResponseSeconds),
    },
    {
      label: "Second ready replica",
      zeroIdle: formatDurationLabel(zeroIdle.secondReadySeconds),
      warmOne: formatDurationLabel(warmOne.secondReadySeconds),
    },
    {
      label: "Idle cost / hour",
      zeroIdle: formatCurrencyLabel(zeroIdle.idleCostPerHour),
      warmOne: formatCurrencyLabel(warmOne.idleCostPerHour),
    },
    {
      label: "Burst cost / run",
      zeroIdle: formatCurrencyLabel(zeroIdle.burstCost),
      warmOne: formatCurrencyLabel(warmOne.burstCost),
    },
    {
      label: "Burst time to first token (TTFT)",
      zeroIdle: formatBurstTtftLabel(zeroIdle.burstTimeToFirstTokenSeconds),
      warmOne: formatBurstTtftLabel(warmOne.burstTimeToFirstTokenSeconds),
    },
  ];
}
