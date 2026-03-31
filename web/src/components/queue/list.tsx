"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, GripVertical, ListMusic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtTime } from "@/lib/utils";
import { reorderQueue } from "@/services/music";
import type { AppState, QueueItem } from "@/types/music";

type QueueListProps = {
  state: AppState;
  onRemoveFromQueue: (id: string) => void;
};

export const QueueList = ({ state, onRemoveFromQueue }: QueueListProps) => {
  const [items, setItems] = useState<QueueItem[]>(state.queue);
  const dragIndex = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (!dragging) setItems(state.queue);
  }, [state.queue, dragging]);

  const onDragStart = (i: number) => {
    setDragging(true);
    dragIndex.current = i;
  };

  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOver(i);
  };

  const onDrop = (e: React.DragEvent, dropI: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === dropI) {
      setDragOver(null);
      setDragging(false);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(dropI, 0, moved);
    setItems(next);
    setDragOver(null);
    setDragging(false);
    dragIndex.current = null;
    reorderQueue(next.map((i) => i.id));
  };

  const onDragEnd = () => {
    setDragOver(null);
    setDragging(false);
    dragIndex.current = null;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-outline">
        <ListMusic size={13} className="text-muted" />
        <span className="text-[11px] font-bold text-muted tracking-[0.1em] uppercase">Up Next</span>
        <span className="text-[11px] font-mono text-muted bg-muted-3 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
        <Link
          href="/history"
          className="w-[26px] h-[26px] ml-auto flex items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-foreground transition-colors"
          title="History"
        >
          <Clock size={13} />
        </Link>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted animate-fade-up">
          <ListMusic size={38} strokeWidth={1} />
          <p className="text-sm">Queue is empty</p>
          <p className="text-xs opacity-55">Search and add songs above</p>
        </div>
      )}

      <div className="flex flex-col gap-px">
        {items.map((item, i) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={onDragEnd}
            className="q-row flex items-center gap-3 p-[9px_10px] rounded-[11px] transition-colors"
            style={
              dragging
                ? {
                    outline: dragOver === i ? "1px solid rgba(181,255,71,0.35)" : undefined,
                    background: dragOver === i ? "rgba(181,255,71,0.05)" : undefined,
                    opacity: dragIndex.current === i ? 0.4 : 1,
                  }
                : {
                    animation: "slide-right 0.25s ease forwards",
                    animationDelay: `${i * 0.04}s`,
                    opacity: 0,
                  }
            }
          >
            <GripVertical
              size={13}
              className="text-muted opacity-0 q-remove cursor-grab shrink-0"
            />
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
};
