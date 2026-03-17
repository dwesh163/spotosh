"use client";

import { GENRE_PRESETS } from "@/lib/constants";

type GenreChipsProps = {
  onSelect: (query: string) => void;
};

export const GenreChips = ({ onSelect }: GenreChipsProps) => (
  <div className="overflow-x-auto mb-[18px] pb-1">
    <div className="flex gap-[7px] w-max">
      {GENRE_PRESETS.map((preset) => (
        <button
          key={preset.query}
          onClick={() => onSelect(preset.query)}
          className="px-3.5 py-1.5 rounded-full border border-outline bg-card text-foreground text-xs font-semibold font-display cursor-pointer whitespace-nowrap hover:bg-muted-2 transition-colors"
        >
          {preset.label}
        </button>
      ))}
    </div>
  </div>
);
