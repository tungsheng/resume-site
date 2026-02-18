import { Glob } from "bun";
import { parse } from "yaml";
import { config } from "../../config";
import { logger } from "../../logger";
import type { ResumeData } from "../../types";
import { sanitizeName } from "../../utils";
import { normalizeResumeData } from "./normalize";

export async function listResumes(): Promise<string[]> {
  const glob = new Glob("*.{yaml,yml}");
  const files: string[] = [];
  for await (const file of glob.scan(config.resumesDir)) {
    files.push(file.replace(/\.(yaml|yml)$/, ""));
  }
  return files;
}

export async function loadResume(name: string): Promise<ResumeData | null> {
  const sanitized = sanitizeName(name);
  if (!sanitized) return null;

  const yamlPath = `${config.resumesDir}/${sanitized}.yaml`;
  const ymlPath = `${config.resumesDir}/${sanitized}.yml`;

  const yamlFile = Bun.file(yamlPath);
  const ymlFile = Bun.file(ymlPath);

  let content: string | null = null;
  if (await yamlFile.exists()) {
    content = await yamlFile.text();
  } else if (await ymlFile.exists()) {
    content = await ymlFile.text();
  }

  if (!content) return null;

  try {
    const data = parse(content);
    const normalized = normalizeResumeData(data);
    if (!normalized) {
      logger.warn("Invalid resume structure", { resume: sanitized });
      return null;
    }
    return normalized;
  } catch (err) {
    logger.warn("Failed to parse resume YAML", { resume: sanitized, error: String(err) });
    return null;
  }
}
