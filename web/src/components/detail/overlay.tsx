"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TrackRow } from "@/components/track/row";
import type { DetailView, ItunesTrack } from "@/types/music";

type DetailOverlayProps = {
  detail: DetailView;
  onClose: () => void;
  onAdd: (track: ItunesTrack) => void;
};

export const DetailOverlay = ({ detail, onClose, onAdd }: DetailOverlayProps) => {
  const [tracks, setTracks] = useState<ItunesTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTracks([]);
    setLoading(true);
    const term = detail.kind === "album" ? `${detail.artist ?? ""} ${detail.name}` : detail.name;
    fetch(`/api/search?q=${encodeURIComponent(term)}&limit=25`)
      .then((r) => r.json() as Promise<{ results: ItunesTrack[] }>)
      .then((data) => setTracks(data.results ?? []))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, [detail.name, detail.kind, detail.artist]);

  const handleAdd = useCallback(
    (track: ItunesTrack) => {
      onAdd(track);
      onClose();
    },
    [onAdd, onClose]
  );

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        background: "var(--color-bg)",
        display: "flex", flexDirection: "column",
        animation: "slide-right 0.2s ease forwards",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "18px 24px", borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0,
        }}
      >
        <button className="btn-icon" style={{ width: 34, height: 34 }} onClick={onClose}>
          <ArrowLeft size={17} />
        </button>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {detail.name}
          </p>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
            {detail.kind === "artist" ? "Artist" : `Album · ${detail.artist ?? ""}`}
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", color: "var(--color-muted)" }}>
            <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
        {!loading && tracks.map((track) => (
          <TrackRow key={track.trackId} track={track} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
};
