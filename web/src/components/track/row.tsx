"use client"

import { Fragment } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { fmtTime } from "@/lib/utils"
import type { ItunesTrack } from "@/types/music"

type TrackRowProps = {
  track: ItunesTrack
  onAdd: (t: ItunesTrack) => void
  onRemove?: (t: ItunesTrack) => void
}

export const TrackRow = ({ track, onAdd, onRemove }: TrackRowProps) => (
  <div
    className="q-row"
    style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 10px", borderRadius: 11 }}
  >
    <img
      src={track.artworkUrl100}
      alt={track.collectionName || track.trackName}
      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {track.trackName}
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--color-muted)",
          marginTop: 2,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <Link
          href={`/artist/${encodeURIComponent(track.artistName)}`}
          style={{ color: "inherit", textDecoration: "none", transition: "opacity 0.12s" }}
        >
          {track.artistName}
        </Link>
        {track.collectionName && (
          <Fragment>
            {" "}
            <span style={{ opacity: 0.4 }}>·</span>{" "}
            <Link
              href={`/album/${encodeURIComponent(track.collectionName)}/${encodeURIComponent(track.artistName)}`}
              style={{ color: "inherit", textDecoration: "none", opacity: 0.7, transition: "opacity 0.12s" }}
            >
              {track.collectionName}
            </Link>
          </Fragment>
        )}
      </p>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <span style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
        {fmtTime(track.trackTimeMillis)}
      </span>
      {onRemove && (
        <button
          onClick={() => onRemove(track)}
          className="q-remove"
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(255,100,100,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            opacity: 0,
            transition: "opacity 0.15s",
          }}
        >
          <Trash2 size={11} color="#ff6b6b" />
        </button>
      )}
      <button
        onClick={() => onAdd(track)}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "rgba(181,255,71,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Plus size={12} color="var(--color-accent)" />
      </button>
    </div>
  </div>
)
