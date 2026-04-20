import { siteProfile } from "./profile";
import type { NarrativeCard } from "./types";

export const aboutContent = {
  eyebrow: "About",
  title: "How I Work",
  bio: [
    "I’m a staff-level software engineer focused on platform engineering, distributed systems, and ML inference infrastructure.",
    "I do my best work on systems where behavior matters as much as code quality: autoscaling control loops, reliability under burst, modernization under real delivery pressure, and the cost-versus-latency tradeoffs that show up in production decisions.",
  ],
  workingStyle: [
    {
      title: "System-first thinking",
      body:
        "I like understanding how request flow, capacity management, and operator workflows interact, not just polishing one isolated service in the middle.",
    },
    {
      title: "Cross-functional execution",
      body:
        "I’m comfortable moving between backend, platform, infra, and delivery conversations so projects keep momentum even when dependencies span several teams.",
    },
    {
      title: "Practical modernization",
      body:
        "I care about changes that improve reliability, release confidence, and development speed in concrete ways, not rewrites that only look cleaner on paper.",
    },
  ] satisfies NarrativeCard[],
  valueAreas: [
    {
      title: "Cloud inference systems",
      body:
        "Kubernetes-based serving, autoscaling, capacity reasoning, and the operational tradeoffs that come with GPU-backed workloads.",
    },
    {
      title: "Platform engineering",
      body:
        "Developer workflows, infrastructure automation, deployment reliability, and the tooling that makes teams move faster with less risk.",
    },
    {
      title: "Leadership scope",
      body:
        "Architecture direction, technical mentorship, and aligning product, platform, and implementation constraints into an executable plan.",
    },
  ] satisfies NarrativeCard[],
  roles:
    "I’m targeting senior to staff platform, infrastructure, and cloud inference roles where I can work on real systems behavior, operational quality, and architecture-level decisions.",
  lookingFor:
    "The best fit is a team that values hands-on engineering depth, clear technical ownership, and thoughtful tradeoffs between product velocity and system reliability.",
  contactLinks: [
    {
      label: "GitHub",
      href: siteProfile.githubUrl,
      detail: "Code, manifests, and experiment workflows",
    },
    {
      label: "LinkedIn",
      href: siteProfile.linkedinUrl,
      detail: "Professional profile and work history",
    },
    {
      label: "Email",
      href: `mailto:${siteProfile.email}`,
      detail: siteProfile.email,
    },
  ],
};
