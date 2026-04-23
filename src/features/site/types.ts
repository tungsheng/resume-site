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

export interface WorkflowNode {
  label: string;
  href?: string;
  linkLabel?: string;
}

export interface WorkflowTrack {
  title: string;
  summary: string;
  nodes: WorkflowNode[];
}

export interface ImplementationStep {
  title: string;
  command: string;
  body: string;
}

export interface ImplementationMeasurement {
  title: string;
  command: string;
  body: string;
  outputs: string[];
  links: ImplementationSourceLink[];
}

export interface ImplementationSourceLink {
  label: string;
  href: string;
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

export interface HighlightCard {
  id: ExperimentFamilyId;
  title: string;
  summary: string;
}

export interface SiteProfile {
  name: string;
  summary: string;
  githubUrl: string;
  linkedinUrl: string;
}
