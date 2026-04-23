export async function requestPublicResumePdf(): Promise<Blob> {
  const res = await fetch("/api/public-pdf", {
    method: "POST",
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const errorBody = (await res.json()) as { error?: string };
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // Keep the fallback error message when the response is not JSON.
    }
    throw new Error(message);
  }

  return res.blob();
}
