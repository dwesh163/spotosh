"use client";

import { useCallback, useState } from "react";

type ControlAction = "pause" | "resume" | "skip" | "back" | "volume" | "seek";

export const useControls = () => {
  const [error, setError] = useState<string | null>(null);

  const sendControl = useCallback(async ({ action, value }: { action: ControlAction; value?: number }) => {
    setError(null);
    try {
      const res = await fetch("/api/controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        const msg = data.error ?? `Error ${res.status}`;
        setError(msg);
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError("Server unreachable");
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  return { sendControl, error };
};
