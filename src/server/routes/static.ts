export async function handleStaticFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const staticFile = Bun.file(`public${path}`);
  if (await staticFile.exists()) {
    return new Response(staticFile);
  }
  return null;
}
