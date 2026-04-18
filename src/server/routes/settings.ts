import { getResumeSettings } from "../../services/settings";
import type { RequestWithParams } from "../http/request";
import { readPathParam } from "../http/request";
import { json } from "../http/response";

export async function handleGetSettings(req: RequestWithParams): Promise<Response> {
  const name = readPathParam(req, "name", "/api/settings/");
  const settings = getResumeSettings(name);
  return json(settings);
}
