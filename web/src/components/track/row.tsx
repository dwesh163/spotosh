"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { fmtTime } from "@/lib/utils";
import type { Track } from "@/types/music";

type TrackRowProps = {
  track: Track;
  onAdd: (t: Track) => void;
  onRemove?: (t: Track) => void;
};

export const TrackRow = ({ track, onAdd, onRemove }: TrackRowProps) => (
  <div className="q-row flex items-center gap-3 p-[9px_10px] rounded-[11px]">
    <img
      src={track.artworkUrl100}
      alt={track.collectionName || track.trackName}
      className="w-10 h-10 rounded-lg object-cover shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
        {track.trackName}
      </p>
      <p className="text-[11px] text-muted mt-0.5 overflow-hidden whitespace-nowrap text-ellipsis">
        <Link
          href={`/artist/${encodeURIComponent(track.artistName)}`}
          className="text-inherit no-underline hover:opacity-65 transition-opacity"
        >
          {track.artistName}
        </Link>
        {track.collectionName && (
          <Fragment>
            {" "}
            <span className="opacity-40">·</span>{" "}
            <Link
              href={`/album/${encodeURIComponent(track.collectionName)}/${encodeURIComponent(track.artistName)}`}
              className="text-inherit no-underline opacity-70 hover:opacity-45 transition-opacity"
            >
              {track.collectionName}
            </Link>
          </Fragment>
        )}
      </p>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-[11px] text-muted font-mono">{fmtTime(track.trackTimeMillis)}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(track)}
          className="q-remove w-6 h-6 rounded-full bg-[rgba(255,100,100,0.1)] flex items-center justify-center border-none cursor-pointer shrink-0 opacity-0 transition-opacity"
        >
          <Trash2 size={11} color="#ff6b6b" />
        </button>
      )}
      <button
        onClick={() => onAdd(track)}
        className="w-6 h-6 rounded-full bg-[rgba(181,255,71,0.12)] flex items-center justify-center border-none cursor-pointer shrink-0"
      >
        <Plus size={12} color="var(--color-accent)" />
      </button>
    </div>
  </div>
);
