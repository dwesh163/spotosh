export type ItunesTrack = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
};

export type QueueItem = {
  id: string;
  trackId: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  durationMs: number;
  addedAt: number;
};

export type AppState = {
  queue: QueueItem[];
  nowPlaying: QueueItem | null;
  isPlaying: boolean;
  progressMs: number;
  volume: number;
  connected: boolean;
  userCount: number;
  canGoBack: boolean;
};

export type HistoryItem = QueueItem & {
  playedAt: number;
};

export type DetailView = {
  kind: "artist" | "album";
  name: string;
  artist?: string;
};

export type GenrePreset = {
  label: string;
  query: string;
};

export type MobileTab = "player" | "queue";
