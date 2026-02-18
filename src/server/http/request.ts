export type RequestWithParams = Request & { params?: Record<string, string> };

export function readPathParam(req: RequestWithParams, name: string, fallbackPrefix: string): string {
  const fromRoute = req.params?.[name];
  if (typeof fromRoute === "string" && fromRoute.length > 0) return fromRoute;
  return new URL(req.url).pathname.replace(fallbackPrefix, "");
}
