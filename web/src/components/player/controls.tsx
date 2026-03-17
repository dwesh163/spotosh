"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QueueItem } from "@/types/music";

type PlayerControlsProps = {
  nowPlaying: QueueItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipNext: () => void;
};

export const PlayerControls = ({
  nowPlaying,
  isPlaying,
  onTogglePlay,
  onSkipBack,
  onSkipNext,
}: PlayerControlsProps) => (
  <div className="flex items-center justify-center gap-2.5">
    <Button variant="icon" size="icon" onClick={onSkipBack} disabled={!nowPlaying}>
      <SkipBack size={20} />
    </Button>
    <button
      onClick={onTogglePlay}
      disabled={!nowPlaying}
      className={cn(
        "w-[54px] h-[54px] rounded-full border-none flex items-center justify-center shrink-0 transition-transform active:scale-95",
        nowPlaying
          ? "bg-accent text-black cursor-pointer hover:opacity-90"
          : "bg-muted-2 text-muted cursor-not-allowed"
      )}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
    </button>
    <Button variant="icon" size="icon" onClick={onSkipNext}>
      <SkipForward size={20} />
    </Button>
  </div>
);
