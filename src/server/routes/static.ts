import { posix as path } from "node:path";

export function resolveStaticAssetPath(pathname: string): string | null {
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (
    decodedPathname.includes("\0") ||
    decodedPathname.includes("\\") ||
    decodedPathname.split("/").some((segment) => segment === "..")
  ) {
    return null;
  }

  const normalizedPath = path.normalize(decodedPathname).replace(/^\/+/, "");
  if (!normalizedPath || normalizedPath === ".") {
    return null;
  }

  return `public/${normalizedPath}`;
}

export async function handleStaticFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const resolvedPath = resolveStaticAssetPath(url.pathname);
  if (!resolvedPath) return null;

  const staticFile = Bun.file(resolvedPath);
  if (await staticFile.exists()) {
    return new Response(staticFile);
  }
  return null;
}
