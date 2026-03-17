"use client";

import { useCallback, useRef, useState } from "react";
import type { ItunesTrack } from "@/types/music";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItunesTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setShowResults(true);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json() as { results: ItunesTrack[] };
        setResults(data.results ?? []);
      } catch {
        // silent
      } finally {
        setSearching(false);
      }
    }, 380);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  }, []);

  return { query, results, searching, showResults, setShowResults, handleSearch, clearSearch };
};
