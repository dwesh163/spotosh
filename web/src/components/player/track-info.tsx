"use client"

import { Fragment } from "react"
import Link from "next/link"
import type { QueueItem } from "@/types/music"

type TrackInfoProps = {
  nowPlaying: QueueItem | null
}

export const TrackInfo = ({ nowPlaying }: TrackInfoProps) => {
  if (!nowPlaying) return (
    <div style={{ minHeight: 48 }}>
      <div style={{ height: 18, width: "65%", background: "var(--color-muted-2)", borderRadius: 5, marginBottom: 8 }} />
      <div style={{ height: 13, width: "42%", background: "var(--color-muted-2)", borderRadius: 5 }} />
    </div>
  )

  const linkStyle: React.CSSProperties = {
    color: "inherit",
    textDecoration: "none",
    transition: "opacity 0.1s",
  }

  return (
    <div style={{ minHeight: 48, animation: "fade-up 0.3s ease forwards" }}>
      <p
        style={{
          fontSize: 19,
          fontWeight: 800,
          marginBottom: 4,
          lineHeight: 1.2,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {nowPlaying.title}
      </p>
      <p
        style={{
          fontSize: 13,
          color: "var(--color-muted)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <Link href={`/artist/${encodeURIComponent(nowPlaying.artist)}`} style={linkStyle}>
          {nowPlaying.artist}
        </Link>
        {nowPlaying.album && (
          <Fragment>
            <span style={{ opacity: 0.5 }}> · </span>
            <Link
              href={`/album/${encodeURIComponent(nowPlaying.album)}/${encodeURIComponent(nowPlaying.artist)}`}
              style={{ ...linkStyle, opacity: 0.65 }}
            >
              {nowPlaying.album}
            </Link>
          </Fragment>
        )}
      </p>
    </div>
  )
}
