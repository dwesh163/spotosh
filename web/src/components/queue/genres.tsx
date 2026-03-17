"use client";

import { GENRE_PRESETS } from "@/lib/constants";

type GenreChipsProps = {
  onSelect: (query: string) => void;
};

export const GenreChips = ({ onSelect }: GenreChipsProps) => (
  <div style={{ overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
    <div style={{ display: "flex", gap: 7, width: "max-content" }}>
      {GENRE_PRESETS.map((preset) => (
        <button
          key={preset.query}
          onClick={() => onSelect(preset.query)}
          style={{
            padding: "6px 14px", borderRadius: 99,
            border: "1px solid var(--color-outline)",
            background: "var(--color-card)",
            color: "var(--color-text)",
            fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)",
            cursor: "pointer", whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted-2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-card)"; }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  </div>
);
