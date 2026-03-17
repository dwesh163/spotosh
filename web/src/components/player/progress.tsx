"use client";

import { fmtTime } from "@/lib/utils";
import type { QueueItem } from "@/types/music";

type ProgressProps = {
  nowPlaying: QueueItem | null;
  progressMs: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export const Progress = ({ nowPlaying, progressMs, onSeek }: ProgressProps) => {
  const progress = nowPlaying ? progressMs / (nowPlaying.durationMs || 30_000) : 0;

  return (
    <div>
      <div
        onClick={onSeek}
        style={{
          height: 6, borderRadius: 3, background: "var(--color-muted-2)",
          overflow: "hidden", opacity: nowPlaying ? 1 : 0.3,
          cursor: nowPlaying ? "pointer" : "default",
        }}
      >
        <div
          style={{
            height: "100%", width: `${progress * 100}%`,
            background: "var(--color-accent)", borderRadius: 3,
            transition: "width 0.4s linear",
          }}
        />
      </div>
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 11, color: "var(--color-muted)",
          fontFamily: "var(--font-mono)", marginTop: 5,
        }}
      >
        <span>{fmtTime(progressMs)}</span>
        <span>{fmtTime(nowPlaying?.durationMs ?? 0)}</span>
      </div>
    </div>
  );
};
