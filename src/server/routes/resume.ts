import { listResumes, loadResume } from "../../domain/resume/load";
import type { RequestWithParams } from "../http";
import { json, notFound, readPathParam } from "../http";

export async function handleListResumes(): Promise<Response> {
  const resumes = await listResumes();
  return json({ resumes });
}

export async function handleGetResume(req: RequestWithParams): Promise<Response> {
  const name = readPathParam(req, "name", "/api/resume/");
  const data = await loadResume(name);
  if (!data) {
    return notFound("Resume not found");
  }
  return json(data);
}
