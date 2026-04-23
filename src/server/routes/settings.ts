import { getResumeSettings } from "../../features/resume/presentation";
import type { RequestWithParams } from "../http";
import { json, readPathParam } from "../http";

export async function handleGetSettings(req: RequestWithParams): Promise<Response> {
  const name = readPathParam(req, "name", "/api/settings/");
  const settings = getResumeSettings(name);
  return json(settings);
}
