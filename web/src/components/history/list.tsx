"use client";

import { Clock, Plus, Trash2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { addToQueue, removeFromHistory } from "@/services/music";
import { fmtTime, timeAgo } from "@/lib/utils";
import type { HistoryItem } from "@/types/music";

type HistoryListProps = {
  initialHistory: HistoryItem[];
};

export const HistoryList = ({ initialHistory }: HistoryListProps) => {
  const [history, setHistory] = useState(initialHistory);

  const handleAddToQueue = useCallback(async (item: HistoryItem) => {
    await addToQueue({
      trackId: item.trackId,
      title: item.title,
      artist: item.artist,
      album: item.album,
      artwork: item.artwork,
      durationMs: item.durationMs,
    });
  }, []);

  const handleRemoveFromHistory = useCallback(async (id: string) => {
    await removeFromHistory(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  if (history.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted">
        <Clock size={38} strokeWidth={1} />
        <p className="text-sm">No history yet</p>
      </div>
    );

  return (
    <div>
      {history.map((item, i) => (
        <Fragment key={`${item.trackId}-${i}`}>
          <div className="flex items-center gap-2 rounded-[11px] group hover:bg-white/[0.06] transition-colors">
            <button
              onClick={() => handleAddToQueue(item)}
              className="flex-1 flex items-center gap-3 p-[9px_10px] rounded-[11px] bg-transparent border-none cursor-pointer text-left text-foreground font-display min-w-0"
            >
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
                  {item.artist}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-muted font-mono">{timeAgo(item.playedAt)}</p>
                <div className="mt-1 w-6 h-6 rounded-full bg-[rgba(181,255,71,0.12)] flex items-center justify-center ml-auto">
                  <Plus size={12} color="var(--color-accent)" />
                </div>
              </div>
            </button>
            <button
              onClick={() => handleRemoveFromHistory(item.id)}
              className="shrink-0 w-7 h-7 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-center text-muted mr-1 hover:text-[#ff5555] transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
