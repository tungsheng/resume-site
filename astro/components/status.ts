import type { DecisionStatus, ExperimentReadinessTone } from "@site";

// Unified 3-value status display for the work section. The data modules keep
// their finer-grained vocabularies (six decision statuses, five readiness
// tones); index and project pages collapse them to one scale a visitor can
// read at a glance, and the nuance stays in each record's call/evidence copy.
export type UnifiedStatus = "Supported" | "Rejected" | "In progress";

const UNIFIED_COLOR: Record<UnifiedStatus, string> = {
  Supported: "#006b40",
  Rejected: "#b3261e",
  "In progress": "#8a4413",
};

const DECISION_TO_UNIFIED: Record<DecisionStatus, UnifiedStatus> = {
  Supported: "Supported",
  Measured: "Supported",
  Rejected: "Rejected",
  Caveated: "In progress",
  Partial: "In progress",
  Blocked: "In progress",
};

const READINESS_TO_UNIFIED: Record<ExperimentReadinessTone, UnifiedStatus> = {
  supported: "Supported",
  selected: "Supported",
  rejected: "Rejected",
  pending: "In progress",
  blocked: "In progress",
};

export function unifyDecisionStatus(status: DecisionStatus): UnifiedStatus {
  return DECISION_TO_UNIFIED[status];
}

export function unifyReadinessTone(tone: ExperimentReadinessTone): UnifiedStatus {
  return READINESS_TO_UNIFIED[tone];
}

export function unifiedStatusStyle(status: UnifiedStatus): string {
  return `color:${UNIFIED_COLOR[status]}`;
}
