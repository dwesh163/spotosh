"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSimilarTracks } from "@/services/lastfm"
import { addToQueue } from "@/services/music"
import type { HistoryItem, ItunesTrack, QueueItem } from "@/types/music"

type UseRecommendationsParams = {
  history: HistoryItem[]
  queue: QueueItem[]
  nowPlaying: QueueItem | null
}

export const useRecommendations = ({ history, queue, nowPlaying }: UseRecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<ItunesTrack[]>([])
  const [recsLoading, setRecsLoading] = useState(false)
  const autoFilledRef = useRef(false)

  useEffect(() => {
    if (history.length === 0) return
    let cancelled = false
    setRecsLoading(true)
    setRecommendations([])

    const toQuery = history.slice(0, Math.min(3, history.length))
    Promise.all(
      toQuery.map((t) => getSimilarTracks(t.artist, t.title).catch(() => [] as ItunesTrack[]))
    ).then((results) => {
      if (cancelled) return
      const seen = new Set<number>()
      const merged: ItunesTrack[] = []
      for (const list of results) {
        if (!Array.isArray(list)) continue
        for (const track of list) {
          if (!seen.has(track.trackId)) {
            seen.add(track.trackId)
            merged.push(track)
          }
        }
      }
      setRecommendations(merged)
    }).finally(() => { if (!cancelled) setRecsLoading(false) })

    return () => { cancelled = true }
  }, [history[0]?.id])

  useEffect(() => { autoFilledRef.current = false }, [recommendations])

  useEffect(() => {
    if (autoFilledRef.current) return
    if (recommendations.length === 0) return
    if (queue.length > 0 || nowPlaying) return
    autoFilledRef.current = true
    recommendations.slice(0, 5).forEach((track) =>
      addToQueue({
        trackId: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName ?? "",
        artwork: track.artworkUrl100 ?? "",
        durationMs: track.trackTimeMillis ?? 0,
      })
    )
  }, [queue.length, nowPlaying?.id, recommendations])

  const removeRecommendation = useCallback(
    (track: ItunesTrack) =>
      setRecommendations((prev) => prev.filter((r) => r.trackId !== track.trackId)),
    []
  )

  return { recommendations, recsLoading, removeRecommendation }
}
