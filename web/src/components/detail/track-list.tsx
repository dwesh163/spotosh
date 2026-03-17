"use client";

import { useCallback } from "react";
import { TrackRow } from "@/components/track/row";
import { addToQueue } from "@/services/music";
import type { Track } from "@/types/music";

type TrackListProps = {
  tracks: Track[];
};

export const TrackList = ({ tracks }: TrackListProps) => {
  const handleAdd = useCallback(async (track: Track) => {
    await addToQueue({
      trackId: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName ?? "",
      artwork: track.artworkUrl100 ?? "",
      durationMs: track.trackTimeMillis ?? 0,
    });
  }, []);

  if (tracks.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted">
        <p className="text-sm">No tracks found</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-px">
      {tracks.map((track) => (
        <TrackRow key={track.trackId} track={track} onAdd={handleAdd} />
      ))}
    </div>
  );
};
