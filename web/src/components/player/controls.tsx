"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { QueueItem } from "@/types/music";

type PlayerControlsProps = {
  nowPlaying: QueueItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipNext: () => void;
};

export const PlayerControls = ({ nowPlaying, isPlaying, onTogglePlay, onSkipBack, onSkipNext }: PlayerControlsProps) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <button className="btn-icon" style={{ width: 40, height: 40 }} onClick={onSkipBack} disabled={!nowPlaying}>
      <SkipBack size={20} />
    </button>
    <button
      onClick={onTogglePlay}
      disabled={!nowPlaying}
      style={{
        width: 54, height: 54, borderRadius: "50%", border: "none",
        background: nowPlaying ? "var(--color-accent)" : "var(--color-muted-2)",
        color: nowPlaying ? "#000" : "var(--color-muted)",
        cursor: nowPlaying ? "pointer" : "not-allowed",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.1s, background 0.2s", flexShrink: 0,
      }}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
    </button>
    <button className="btn-icon" style={{ width: 40, height: 40 }} onClick={onSkipNext}>
      <SkipForward size={20} />
    </button>
  </div>
);
