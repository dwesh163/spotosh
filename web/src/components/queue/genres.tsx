"use client";

import { Loader2 } from "lucide-react";
import { GENRE_PRESETS } from "@/lib/constants";
import type { GenrePreset } from "@/types/music";

type GenreChipsProps = {
  onSelect: (preset: GenrePreset) => void;
  loadingId?: number;
};

export const GenreChips = ({ onSelect, loadingId }: GenreChipsProps) => (
  <div className="overflow-x-auto mb-[18px] pb-1">
    <div className="flex gap-[7px] w-max">
      {GENRE_PRESETS.map((preset) => {
        const id = preset.genreId ?? preset.playlistId;
        const isLoading = loadingId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(preset)}
            disabled={loadingId != null}
            className="px-3.5 py-1.5 rounded-full border border-outline bg-card text-foreground text-xs font-semibold font-display cursor-pointer whitespace-nowrap hover:bg-muted-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoading && <Loader2 size={11} className="animate-spin-slow" />}
            {preset.label}
          </button>
        );
      })}
    </div>
  </div>
);
