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
        className="h-1.5 rounded-[3px] bg-muted-2 overflow-hidden"
        style={{ opacity: nowPlaying ? 1 : 0.3, cursor: nowPlaying ? "pointer" : "default" }}
      >
        <div
          className="h-full bg-accent rounded-[3px] transition-[width] duration-400"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted font-mono mt-[5px]">
        <span>{fmtTime(progressMs)}</span>
        <span>{fmtTime(nowPlaying?.durationMs ?? 0)}</span>
      </div>
    </div>
  );
};
