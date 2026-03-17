"use client";

import { Volume2, VolumeX } from "lucide-react";

type VolumeControlProps = {
  volume: number;
  muted: boolean;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
};

export const VolumeControl = ({ volume, muted, onVolumeChange, onToggleMute }: VolumeControlProps) => {
  const localVolume = muted ? 0 : volume;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button className="btn-icon" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={onToggleMute}>
        {muted || localVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
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
