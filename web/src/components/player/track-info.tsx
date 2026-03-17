"use client";

import { Fragment } from "react";
import type { QueueItem } from "@/types/music";
import type { DetailView } from "@/types/music";

type TrackInfoProps = {
  nowPlaying: QueueItem | null;
  onOpenDetail: (detail: DetailView) => void;
};

const linkStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "inherit", fontFamily: "inherit", fontSize: "inherit",
  padding: 0, textDecoration: "none", transition: "opacity 0.1s",
};

export const TrackInfo = ({ nowPlaying, onOpenDetail }: TrackInfoProps) => {
  if (!nowPlaying) return (
    <div style={{ minHeight: 48 }}>
      <div style={{ height: 18, width: "65%", background: "var(--color-muted-2)", borderRadius: 5, marginBottom: 8 }} />
      <div style={{ height: 13, width: "42%", background: "var(--color-muted-2)", borderRadius: 5 }} />
    </div>
  );

  return (
    <div style={{ minHeight: 48, animation: "fade-up 0.3s ease forwards" }}>
      <p style={{ fontSize: 19, fontWeight: 800, marginBottom: 4, lineHeight: 1.2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {nowPlaying.title}
      </p>
      <p style={{ fontSize: 13, color: "var(--color-muted)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        <button
          style={linkStyle}
          onClick={() => onOpenDetail({ kind: "artist", name: nowPlaying.artist })}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {nowPlaying.artist}
        </button>
        {nowPlaying.album && (
          <Fragment>
            <span style={{ opacity: 0.5 }}> · </span>
            <button
              style={{ ...linkStyle, opacity: 0.65 }}
              onClick={() => onOpenDetail({ kind: "album", name: nowPlaying.album, artist: nowPlaying.artist })}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.45"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.65"; }}
            >
              {nowPlaying.album}
            </button>
          </Fragment>
        )}
      </p>
    </div>
  );
};
