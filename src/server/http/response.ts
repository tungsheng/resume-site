interface JsonInit {
  status?: number;
  headers?: HeadersInit;
}

export function json<T>(body: T, init?: JsonInit): Response {
  return Response.json(body, init);
}

export function error(status: number, message: string): Response {
  return json({ error: message }, { status });
}

export function badRequest(message: string): Response {
  return error(400, message);
}

export function notFound(message: string = "Not found"): Response {
  return error(404, message);
}

export function tooManyRequests(message: string): Response {
  return error(429, message);
}
