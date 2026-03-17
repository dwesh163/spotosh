"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type VolumeControlProps = {
  volume: number;
  muted: boolean;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
};

export const VolumeControl = ({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) => {
  const localVolume = muted ? 0 : volume;

  return (
    <div className="flex items-center gap-2.5">
      <Button variant="icon" size="icon-sm" onClick={onToggleMute} className="shrink-0">
        {muted || localVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </Button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={localVolume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="range-input"
        style={{
          background: `linear-gradient(to right, var(--color-muted) ${localVolume}%, var(--color-muted-2) ${localVolume}%)`,
        }}
      />
    </div>
  );
};
