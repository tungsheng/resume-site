import { listResumes, loadResume } from "../../domain/resume";
import type { RequestWithParams } from "../http/request";
import { readPathParam } from "../http/request";
import { json, notFound } from "../http/response";

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
