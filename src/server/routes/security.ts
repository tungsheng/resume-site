import { getSessionCSRFToken, isAuthenticated } from "../../services/auth";
import { getSessionToken, validateCSRFToken } from "../../utils";
import { forbidden, unauthorized } from "../http/response";

export function requireAuthenticatedMutation(req: Request): Response | null {
  if (!isAuthenticated(req)) {
    return unauthorized();
  }

  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return unauthorized();
  }

  const csrfToken = getSessionCSRFToken(sessionToken);
  if (!validateCSRFToken(req, csrfToken)) {
    return forbidden("Invalid CSRF token");
  }

  return null;
}
