export type PublicNavKey = "home" | "project" | "experiments" | "resume";

export interface TimelineEvent {
  label: string;
  seconds: number;
  emphasis?: boolean;
}

export interface ProofExcerpt {
  title: string;
  command: string;
  lines: string[];
}

export interface EvidenceExcerpt extends ProofExcerpt {
  subtitle: string;
  reportDate: string;
}

export interface NarrativeCard {
  title: string;
  body: string;
}

export interface MetricPoint {
  label: string;
  value: string;
  detail: string;
}

export interface ExperimentSummaryCard extends MetricPoint {
  eyebrow: string;
}

export type ExperimentFamilyId =
  | "profile-baselines"
  | "policy-compare"
  | "target-calibration";

export type ComparisonDirection = "lower" | "higher";

export interface ExperimentComparisonMetric {
  label: string;
  running: string;
  activePressure: string;
  runningValue: number;
  activePressureValue: number;
  betterWhen: ComparisonDirection;
}

export interface ExperimentCalibrationRun extends MetricPoint {
  secondReadySeconds: number;
  burstCost: number;
  peakActiveRequestsPerGpuNode: number;
}

export interface ExperimentProfile {
  id: string;
  label: string;
  reportDate: string;
  baselineGpuState: string;
  firstReadySeconds: number;
  firstPublicResponseSeconds: number;
  secondReadySeconds: number;
  idleCostPerHour: number;
  burstCost: number;
  burstTimeToFirstTokenSeconds: number;
  timeline: TimelineEvent[];
  proofExcerpt: ProofExcerpt;
}

export interface ImplementationLink {
  label: string;
  href: string;
  detail: string;
}

export interface TradeoffItem {
  title: string;
  leftLabel: string;
  leftBody: string;
  rightLabel: string;
  rightBody: string;
}

export interface HighlightCard {
  id: ExperimentFamilyId;
  title: string;
  summary: string;
}

export interface SiteProfile {
  name: string;
  title: string;
  summary: string;
  resumeSlug: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
}
