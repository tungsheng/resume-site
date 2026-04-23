import type { SiteProfile } from "./types";

export const PROJECT_PATH = "/project/cloud-inference-platform";
export const EXPERIMENTS_PATH = "/experiments";
export const RESUME_PATH = "/resume";

export const siteProfile: SiteProfile = {
  name: "Tony Lee",
  summary:
    "Recently built a cloud inference platform on AWS and Kubernetes with queue-aware autoscaling, mixed-capacity GPU pools, and measured zero-idle vs warm-baseline behavior.",
  githubUrl: "https://github.com/tungsheng/gpu-inference-lab",
  linkedinUrl: "https://linkedin.com/in/tonyslee8",
};

export { experimentsContent } from "./experiments-content";
export { implementation, projectContent } from "./project-content";
