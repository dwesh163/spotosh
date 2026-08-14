"use client";

import { fmtTime } from "@/lib/utils";
import type { QueueItem } from "@/types/music";

type ProgressProps = {
  nowPlaying: QueueItem | null;
  progressMs: number;
  onSeek: (ratio: number) => void;
};

const KEYBOARD_SEEK_STEP = 0.02;

export const Progress = ({ nowPlaying, progressMs, onSeek }: ProgressProps) => {
  const progress = nowPlaying ? progressMs / (nowPlaying.durationMs || 30_000) : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!nowPlaying) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onSeek(Math.min(1, progress + KEYBOARD_SEEK_STEP));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onSeek(Math.max(0, progress - KEYBOARD_SEEK_STEP));
    } else if (e.key === "Home") {
      e.preventDefault();
      onSeek(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onSeek(1);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={nowPlaying ? 0 : -1}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
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
