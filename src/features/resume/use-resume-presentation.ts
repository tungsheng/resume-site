import { useEffect, useState } from "react";
import {
  DEFAULT_PUBLIC_RESUME_SETTINGS,
  getPublicResumeFallbackSettings,
  loadPublicResumeSettings,
  type PublicResumeSettings,
} from "./presentation";

export function useResumePresentation(resumeName: string): PublicResumeSettings {
  const [settings, setSettings] = useState(DEFAULT_PUBLIC_RESUME_SETTINGS);

  useEffect(() => {
    const fallback = getPublicResumeFallbackSettings(resumeName);
    setSettings(fallback);

    let cancelled = false;
    void (async () => {
      const nextSettings = await loadPublicResumeSettings(resumeName, fallback);
      if (!cancelled) {
        setSettings(nextSettings);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resumeName]);

  return settings;
}
