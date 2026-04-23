import { parse } from "yaml";
import { logger } from "../../logger";
import type { ResumeData } from "../../types";
import { normalizeResumeData } from "./normalize";

const PUBLIC_RESUME_PATH = "resumes/tony-lee.yaml";

export async function loadResume(): Promise<ResumeData | null> {
  const resumeFile = Bun.file(PUBLIC_RESUME_PATH);
  if (!(await resumeFile.exists())) return null;

  try {
    const data = parse(await resumeFile.text());
    const normalized = normalizeResumeData(data);
    if (!normalized) {
      logger.warn("Invalid public resume structure", { path: PUBLIC_RESUME_PATH });
      return null;
    }
    return normalized;
  } catch (err) {
    logger.warn("Failed to parse public resume YAML", {
      path: PUBLIC_RESUME_PATH,
      error: String(err),
    });
    return null;
  }
}
