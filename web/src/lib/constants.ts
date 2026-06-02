import type { GenrePreset } from "@/types/music";

// Deezer genre IDs for chart lookups (GET /chart/{id}/tracks)
export const GENRE_PRESETS: GenrePreset[] = [
  { label: "Rap FR", query: "rap français" },
  { label: "Hip-Hop", genreId: 116 },
  { label: "Drill", query: "drill" },
  { label: "Pop", genreId: 75 },
  { label: "R&B", genreId: 152 },
  { label: "Rock", genreId: 197 },
  { label: "Électro", genreId: 113 },
  { label: "Afrobeats", query: "afrobeats" },
  { label: "Jazz", genreId: 129 },
  { label: "Trap", query: "trap" },
  { label: "Indie", query: "indie" },
  { label: "Reggaeton", genreId: 144 },
];
