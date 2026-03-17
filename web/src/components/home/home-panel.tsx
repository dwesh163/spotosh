"use client"

import { Loader2, Search, Sparkles, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { GenreChips } from "@/components/queue/genres"
import { QueueList } from "@/components/queue/list"
import { TrackRow } from "@/components/track/row"
import { usePlayer } from "@/hooks/use-player"
import { useRecommendations } from "@/hooks/use-recommendations"
import { useSearch } from "@/hooks/use-search"
import { addToQueue, getHistory, removeFromQueue } from "@/services/music"
import { searchTracks } from "@/services/lastfm"
import type { HistoryItem, ItunesTrack } from "@/types/music"

export const HomePanel = () => {
  const state = usePlayer()
  const { query, results, searching, showResults, setShowResults, handleSearch, clearSearch } = useSearch()
  const [history, setHistory] = useState<HistoryItem[]>([])

  const { recommendations, recsLoading, removeRecommendation } = useRecommendations({
    history,
    queue: state.queue,
    nowPlaying: state.nowPlaying,
  })

  useEffect(() => {
    getHistory().then(setHistory).catch(() => {})
  }, [state.nowPlaying?.id])

  const handleAdd = useCallback(
    async (track: ItunesTrack) => {
      await addToQueue({
        trackId: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName ?? "",
        artwork: track.artworkUrl100 ?? "",
        durationMs: track.trackTimeMillis ?? 0,
      })
      clearSearch()
    },
    [clearSearch]
  )

  const handleRemoveFromQueue = useCallback((id: string) => removeFromQueue(id), [])

  const addGenreToQueue = useCallback(async (genreQuery: string) => {
    try {
      const tracks = await searchTracks(genreQuery)
      await Promise.all(
        tracks.slice(0, 8).map((track) =>
          addToQueue({
            trackId: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName ?? "",
            artwork: track.artworkUrl100 ?? "",
            durationMs: track.trackTimeMillis ?? 0,
          })
        )
      )
    } catch {
      /* silent */
    }
  }, [])

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid var(--color-outline)", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 13, color: "var(--color-muted)", display: "flex" }}>
              {searching ? (
                <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Search size={15} />
              )}
            </div>
            <input
              type="text"
              placeholder="Search catalog…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              style={{
                width: "100%",
                padding: "11px 38px 11px 38px",
                borderRadius: 12,
                background: "var(--color-card)",
                border: `1px solid ${showResults && results.length > 0 ? "var(--color-accent)" : "var(--color-outline)"}`,
                color: "var(--color-text)",
                fontSize: 16,
                fontFamily: "var(--font-display)",
                outline: "none",
                transition: "border-color 0.15s",
              }}
            />
            {query && (
              <button
                onMouseDown={clearSearch}
                style={{
                  position: "absolute",
                  right: 11,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-muted)",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {showResults && results.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "var(--color-surface)",
                border: "1px solid var(--color-outline)",
                borderRadius: 14,
                overflow: "hidden",
                zIndex: 50,
                boxShadow: "0 24px 48px rgba(0,0,0,0.75)",
                maxHeight: 340,
                overflowY: "auto",
                animation: "fade-up 0.18s ease forwards",
              }}
            >
              {results.map((track) => (
                <TrackRow key={track.trackId} track={track} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        <GenreChips onSelect={addGenreToQueue} />
        <QueueList state={state} onRemoveFromQueue={handleRemoveFromQueue} />

        {(recommendations.length > 0 || recsLoading) && (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px solid var(--color-outline)",
              }}
            >
              <Sparkles size={13} color="var(--color-muted)" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Recommended
              </span>
              {recsLoading && (
                <Loader2
                  size={11}
                  style={{ animation: "spin 1s linear infinite", color: "var(--color-muted)", marginLeft: 4 }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {recommendations.map((track) => (
                <TrackRow
                  key={track.trackId}
                  track={track}
                  onAdd={handleAdd}
                  onRemove={removeRecommendation}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
