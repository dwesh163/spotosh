"use client"

import { useCallback } from "react"
import { TrackRow } from "@/components/track/row"
import { addToQueue } from "@/services/music"
import type { ItunesTrack } from "@/types/music"

type TrackListProps = {
  tracks: ItunesTrack[]
}

export const TrackList = ({ tracks }: TrackListProps) => {
  const handleAdd = useCallback(async (track: ItunesTrack) => {
    await addToQueue({
      trackId: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName ?? "",
      artwork: track.artworkUrl100 ?? "",
      durationMs: track.trackTimeMillis ?? 0,
    })
  }, [])

  if (tracks.length === 0) return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "60px 0",
        color: "var(--color-muted)",
      }}
    >
      <p style={{ fontSize: 14 }}>No tracks found</p>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {tracks.map((track) => (
        <TrackRow key={track.trackId} track={track} onAdd={handleAdd} />
      ))}
    </div>
  )
}
