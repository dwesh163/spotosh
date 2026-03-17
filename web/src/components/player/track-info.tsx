"use client";

import { Fragment } from "react";
import Link from "next/link";
import type { QueueItem } from "@/types/music";

type TrackInfoProps = {
  nowPlaying: QueueItem | null;
};

export const TrackInfo = ({ nowPlaying }: TrackInfoProps) => {
  if (!nowPlaying)
    return (
      <div className="min-h-12">
        <div className="h-[18px] w-[65%] bg-muted-2 rounded-[5px] mb-2" />
        <div className="h-[13px] w-[42%] bg-muted-2 rounded-[5px]" />
      </div>
    );

  return (
    <div className="min-h-12 animate-fade-up">
      <p className="text-[19px] font-extrabold mb-1 leading-[1.2] overflow-hidden whitespace-nowrap text-ellipsis">
        {nowPlaying.title}
      </p>
      <p className="text-[13px] text-muted overflow-hidden whitespace-nowrap text-ellipsis">
        <Link
          href={`/artist/${encodeURIComponent(nowPlaying.artist)}`}
          className="text-inherit no-underline hover:opacity-70 transition-opacity"
        >
          {nowPlaying.artist}
        </Link>
        {nowPlaying.album && (
          <Fragment>
            <span className="opacity-50"> · </span>
            <Link
              href={`/album/${encodeURIComponent(nowPlaying.album)}/${encodeURIComponent(nowPlaying.artist)}`}
              className="text-inherit no-underline opacity-65 hover:opacity-45 transition-opacity"
            >
              {nowPlaying.album}
            </Link>
          </Fragment>
        )}
      </p>
    </div>
  );
};
