"use client";

import { Fragment } from "react";
import { Plus, Trash2 } from "lucide-react";
import { fmtTime } from "@/lib/utils";
import type { ItunesTrack } from "@/types/music";

type TrackRowProps = {
  track: ItunesTrack;
  onAdd: (t: ItunesTrack) => void;
  onRemove?: (t: ItunesTrack) => void;
  onArtistClick?: (artist: string) => void;
  onAlbumClick?: (album: string, artist: string) => void;
};

const inlineLinkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  cursor: "pointer",
  transition: "opacity 0.12s",
};

export const TrackRow = ({ track, onAdd, onRemove, onArtistClick, onAlbumClick }: TrackRowProps) => (
  <div
    className="q-row"
    style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 10px", borderRadius: 11 }}
  >
    <img
      src={track.artworkUrl100}
      alt={track.collectionName}
      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {track.trackName}
      </p>
      <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {onArtistClick ? (
          <button
            style={inlineLinkStyle}
            onClick={() => onArtistClick(track.artistName)}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.65"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {track.artistName}
          </button>
        ) : (
          track.artistName
        )}
        {track.collectionName && (
          <Fragment>
            {" "}
            <span style={{ opacity: 0.4 }}>·</span>{" "}
            {onAlbumClick ? (
              <button
                style={{ ...inlineLinkStyle, opacity: 0.7 }}
                onClick={() => onAlbumClick(track.collectionName, track.artistName)}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.45"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
              >
                {track.collectionName}
              </button>
            ) : (
              <span style={{ opacity: 0.7 }}>{track.collectionName}</span>
            )}
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
            width: 24, height: 24, borderRadius: "50%",
            background: "rgba(255,100,100,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer", flexShrink: 0,
            opacity: 0, transition: "opacity 0.15s",
          }}
        >
          <Trash2 size={11} color="#ff6b6b" />
        </button>
      )}
      <button
        onClick={() => onAdd(track)}
        style={{
          width: 24, height: 24, borderRadius: "50%",
          background: "rgba(181,255,71,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer", flexShrink: 0,
        }}
      >
        <Plus size={12} color="var(--color-accent)" />
      </button>
    </div>
  </div>
);
