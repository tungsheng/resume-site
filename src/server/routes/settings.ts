import { isResumeLayoutTemplate } from "../../layouts";
import { getResumeSettings, saveResumeSettings } from "../../services/settings";
import { isValidColor, parseJsonBody } from "../../utils";
import type { RequestWithParams } from "../http/request";
import { readPathParam } from "../http/request";
import { badRequest, json } from "../http/response";
import { requireAuthenticatedMutation } from "./security";

export async function handleGetSettings(req: RequestWithParams): Promise<Response> {
  const name = readPathParam(req, "name", "/api/settings/");
  const settings = getResumeSettings(name);
  return json(settings);
}

export async function handleSaveSettings(req: RequestWithParams): Promise<Response> {
  const authError = requireAuthenticatedMutation(req);
  if (authError) return authError;

  const name = readPathParam(req, "name", "/api/settings/");

  const body = await parseJsonBody<{ themeColor?: string; layoutTemplate?: string }>(req);
  if (!body) {
    return badRequest("Invalid JSON");
  }

  if (body.themeColor === undefined && body.layoutTemplate === undefined) {
    return badRequest("No settings provided");
  }

  if (body.themeColor !== undefined && !isValidColor(body.themeColor)) {
    return badRequest("Invalid theme color");
  }

  if (
    body.layoutTemplate !== undefined &&
    !isResumeLayoutTemplate(body.layoutTemplate)
  ) {
    return badRequest("Invalid layout template");
  }

  const current = getResumeSettings(name);
  const themeColor = body.themeColor ?? current.themeColor;
  const layoutTemplate = body.layoutTemplate ?? current.layoutTemplate;

  const saved = saveResumeSettings(name, themeColor, layoutTemplate);
  if (!saved) {
    return badRequest("Failed to save settings");
  }

  return json({ success: true });
}
