"use client";

import { useEffect, useState } from "react";
import type { AppState } from "@/types/music";

const DEFAULT_STATE: AppState = {
  queue: [],
  nowPlaying: null,
  isPlaying: false,
  progressMs: 0,
  volume: 80,
  connected: false,
  userCount: 0,
  canGoBack: false,
};

export const usePlayer = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let retryDelay = 1000;

    const connect = () => {
      es = new EventSource("/api/events");
      es.onmessage = (e) => {
        setState(JSON.parse(e.data) as AppState);
        retryDelay = 1000;
      };
      es.onerror = () => {
        es.close();
        retryTimeout = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 15_000);
      };
    };

    connect();
    return () => {
      es?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  return state;
};
