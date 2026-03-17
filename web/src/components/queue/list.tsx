"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Clock, ListMusic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtTime } from "@/lib/utils";
import type { AppState } from "@/types/music";

type QueueListProps = {
  state: AppState;
  onRemoveFromQueue: (id: string) => void;
};

export const QueueList = ({ state, onRemoveFromQueue }: QueueListProps) => (
  <div>
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-outline">
      <ListMusic size={13} className="text-muted" />
      <span className="text-[11px] font-bold text-muted tracking-[0.1em] uppercase">Up Next</span>
      <span className="text-[11px] font-mono text-muted bg-muted-3 px-2 py-0.5 rounded-full">
        {state.queue.length}
      </span>
      <Link
        href="/history"
        className="w-[26px] h-[26px] ml-auto flex items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-foreground transition-colors"
        title="History"
      >
        <Clock size={13} />
      </Link>
    </div>

    {state.queue.length === 0 && (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted animate-fade-up">
        <ListMusic size={38} strokeWidth={1} />
        <p className="text-sm">Queue is empty</p>
        <p className="text-xs opacity-55">Search and add songs above</p>
      </div>
    )}

    <div className="flex flex-col gap-px">
      {state.queue.slice(0, 1000).map((item, i) => (
        <div
          key={item.id}
          className="q-row flex items-center gap-3 p-[9px_10px] rounded-[11px] opacity-0"
          style={{
            animation: "slide-right 0.25s ease forwards",
            animationDelay: `${i * 0.04}s`,
          }}
        >
          <span className="w-4 text-[11px] text-center text-muted font-mono shrink-0">{i + 1}</span>
          <img
            src={item.artwork}
            alt={item.album}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
              {item.title}
            </p>
            <p className="text-[11px] text-muted mt-0.5 overflow-hidden whitespace-nowrap text-ellipsis">
              <Link
                href={`/artist/${encodeURIComponent(item.artist)}`}
                className="text-inherit no-underline hover:opacity-65 transition-opacity"
              >
                {item.artist}
              </Link>
              {item.album && (
                <Fragment>
                  {" "}
                  <span className="opacity-40">·</span>{" "}
                  <Link
                    href={`/album/${encodeURIComponent(item.album)}/${encodeURIComponent(item.artist)}`}
                    className="text-inherit no-underline opacity-70 hover:opacity-45 transition-opacity"
                  >
                    {item.album}
                  </Link>
                </Fragment>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-muted font-mono">{fmtTime(item.durationMs)}</span>
            <Button
              variant="icon"
              size="icon-sm"
              onClick={() => onRemoveFromQueue(item.id)}
              className="q-remove opacity-0 transition-opacity"
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
