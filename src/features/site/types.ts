export type PublicNavKey = "home" | "project" | "experiments" | "resume" | "about";

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

export interface NarrativeCard {
  title: string;
  body: string;
}

export interface MetricPoint {
  label: string;
  value: string;
  detail: string;
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
  title: string;
  summary: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
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
