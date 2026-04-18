import { siteProfile } from "./profile";

export const aboutContent = {
  eyebrow: "About",
  title: "About Tony",
  bio: [
    "I’m a staff-level software engineer focused on platform engineering, distributed systems, and ML inference infrastructure.",
    "I like projects where system behavior matters as much as code quality: autoscaling control loops, reliability under burst, and the cost-versus-latency tradeoffs that show up in real production decisions.",
  ],
  currentFocus: [
    "Cloud inference systems on Kubernetes",
    "Queue-aware autoscaling and capacity reasoning",
    "Practical platform engineering for developer velocity and operational reliability",
  ],
  roles:
    "I’m targeting senior to staff platform, infrastructure, and cloud inference roles where I can work on real systems behavior, not just isolated application features.",
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
