import type { GenrePreset } from "@/types/music";

// Deezer chart/playlist IDs — genre: GET /chart/{id}/tracks, playlist: GET /playlist/{id}/tracks
export const GENRE_PRESETS: GenrePreset[] = [
  { label: "Top 50 Monde", playlistId: 3155776842 },
  { label: "Top 50 France", playlistId: 1109890291 },
  { label: "Top 50 Suisse", playlistId: 1313617925 },
  { label: "Hip-Hop", genreId: 116 },
  { label: "Pop", genreId: 75 },
  { label: "R&B", genreId: 152 },
  { label: "Rock", genreId: 197 },
  { label: "Électro", genreId: 113 },
  { label: "Jazz", genreId: 129 },
  { label: "Reggaeton", genreId: 144 },
];
