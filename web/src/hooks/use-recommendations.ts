"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addToQueue } from "@/services/music";
import type { HistoryItem, Track, QueueItem } from "@/types/music";

type UseRecommendationsParams = {
  history: HistoryItem[];
  queue: QueueItem[];
  nowPlaying: QueueItem | null;
};

type Seed = { artist: string; title: string };

// A played track can be recommended again after this long - avoids
// permanently blacklisting songs from a session that started hours ago.
const RECENT_HISTORY_WINDOW_MS = 5 * 60 * 60 * 1000;

const fetchSimilar = async (seeds: Seed[]): Promise<Track[]> => {
  const results = await Promise.all(
    seeds.map((s) =>
      fetch(`/api/similar?artist=${encodeURIComponent(s.artist)}&track=${encodeURIComponent(s.title)}`)
        .then((r) => r.json() as Promise<Track[]>)
        .catch(() => [] as Track[])
    )
  );
  const seen = new Set<number>();
  const merged: Track[] = [];
  for (const list of results) {
    if (!Array.isArray(list)) continue;
    for (const track of list) {
      if (!seen.has(track.trackId)) {
        seen.add(track.trackId);
        merged.push(track);
      }
    }
  }
  return merged;
};

export const useRecommendations = ({ history, queue, nowPlaying }: UseRecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const autoFilledRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (history.length === 0) return;
    const requestId = ++requestIdRef.current;
    setRecsLoading(true);
    setRecommendations([]);

    const seeds = history
      .slice(0, Math.min(3, history.length))
      .map((t) => ({ artist: t.artist, title: t.title }));
    fetchSimilar(seeds).then((merged) => {
      if (requestIdRef.current !== requestId) return;
      setRecommendations(merged);
      setRecsLoading(false);
    });
  }, [history[0]?.id]);

  const refresh = useCallback(() => {
    if (queue.length === 0) return;
    const requestId = ++requestIdRef.current;
    setRecsLoading(true);
    setRecommendations([]);

    const seeds = queue.map((t) => ({ artist: t.artist, title: t.title }));
    fetchSimilar(seeds).then((merged) => {
      if (requestIdRef.current !== requestId) return;
      setRecommendations(merged);
      setRecsLoading(false);
    });
  }, [queue]);

  // Exclude anything already playing or queued, plus anything played recently,
  // so the same song can't show up twice between "Up Next" and "Recommended".
  // Older history falls out of the window so tracks can be recommended again.
  const excludedIds = useMemo(() => {
    const ids = new Set<number>();
    for (const item of queue) ids.add(item.trackId);
    const cutoff = Date.now() - RECENT_HISTORY_WINDOW_MS;
    for (const item of history) {
      if (item.playedAt >= cutoff) ids.add(item.trackId);
    }
    if (nowPlaying) ids.add(nowPlaying.trackId);
    return ids;
  }, [queue, history, nowPlaying]);

  const visibleRecommendations = useMemo(
    () => recommendations.filter((t) => !excludedIds.has(t.trackId)),
    [recommendations, excludedIds]
  );

  useEffect(() => {
    autoFilledRef.current = false;
  }, [visibleRecommendations]);

  useEffect(() => {
    if (autoFilledRef.current) return;
    if (visibleRecommendations.length === 0) return;
    if (queue.length > 0 || nowPlaying) return;
    autoFilledRef.current = true;
    visibleRecommendations.slice(0, 5).forEach((track) =>
      addToQueue({
        trackId: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName ?? "",
        artwork: track.artworkUrl100 ?? "",
        durationMs: track.trackTimeMillis ?? 0,
      })
    );
  }, [queue.length, nowPlaying?.id, visibleRecommendations]);

  const removeRecommendation = useCallback(
    (track: Track) =>
      setRecommendations((prev) => prev.filter((r) => r.trackId !== track.trackId)),
    []
  );

  return {
    recommendations: visibleRecommendations,
    recsLoading,
    removeRecommendation,
    refresh,
    canRefresh: queue.length > 0,
  };
};
