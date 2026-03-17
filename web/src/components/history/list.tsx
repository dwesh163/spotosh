"use client"

import { Clock, Plus, Trash2 } from "lucide-react"
import { Fragment, useCallback, useState } from "react"
import { addToQueue, removeFromHistory } from "@/services/music"
import { fmtTime, timeAgo } from "@/lib/utils"
import type { HistoryItem } from "@/types/music"

type HistoryListProps = {
  initialHistory: HistoryItem[]
}

export const HistoryList = ({ initialHistory }: HistoryListProps) => {
  const [history, setHistory] = useState(initialHistory)

  const handleAddToQueue = useCallback(async (item: HistoryItem) => {
    await addToQueue({
      trackId: item.trackId,
      title: item.title,
      artist: item.artist,
      album: item.album,
      artwork: item.artwork,
      durationMs: item.durationMs,
    })
  }, [])

  const handleRemoveFromHistory = useCallback(async (id: string) => {
    await removeFromHistory(id)
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }, [])

  if (history.length === 0) return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "60px 0",
        color: "var(--color-muted)",
      }}
    >
      <Clock size={38} strokeWidth={1} />
      <p style={{ fontSize: 14 }}>No history yet</p>
    </div>
  )

  return (
    <div>
      {history.map((item, i) => (
        <Fragment key={`${item.trackId}-${i}`}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 11 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none" }}
          >
            <button
              onClick={() => handleAddToQueue(item)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 10px",
                borderRadius: 11,
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                minWidth: 0,
              }}
            >
              <img
                src={item.artwork}
                alt={item.album}
                style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                    marginTop: 2,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.artist}
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                  {timeAgo(item.playedAt)}
                </p>
                <div
                  style={{
                    marginTop: 4,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(181,255,71,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "auto",
                  }}
                >
                  <Plus size={12} color="var(--color-accent)" />
                </div>
              </div>
            </button>
            <button
              onClick={() => handleRemoveFromHistory(item.id)}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-muted)",
                marginRight: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ff5555" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)" }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
