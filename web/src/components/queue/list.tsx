"use client"

import { Fragment } from "react"
import Link from "next/link"
import { Clock, ListMusic, X } from "lucide-react"
import { fmtTime } from "@/lib/utils"
import type { AppState } from "@/types/music"

type QueueListProps = {
  state: AppState
  onRemoveFromQueue: (id: string) => void
}

export const QueueList = ({ state, onRemoveFromQueue }: QueueListProps) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottom: "1px solid var(--color-outline)",
      }}
    >
      <ListMusic size={13} color="var(--color-muted)" />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--color-muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Up Next
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
          background: "var(--color-muted-3)",
          padding: "2px 8px",
          borderRadius: 99,
        }}
      >
        {state.queue.length}
      </span>
      <Link
        href="/history"
        className="btn-icon"
        style={{
          width: 26,
          height: 26,
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="History"
      >
        <Clock size={13} />
      </Link>
    </div>

    {state.queue.length === 0 && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "40px 0",
          color: "var(--color-muted)",
          animation: "fade-up 0.3s ease forwards",
        }}
      >
        <ListMusic size={38} strokeWidth={1} />
        <p style={{ fontSize: 14 }}>Queue is empty</p>
        <p style={{ fontSize: 12, opacity: 0.55 }}>Search and add songs above</p>
      </div>
    )}

    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {state.queue.slice(0, 1000).map((item, i) => (
        <div
          key={item.id}
          className="q-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "9px 10px",
            borderRadius: 11,
            animation: "slide-right 0.25s ease forwards",
            animationDelay: `${i * 0.04}s`,
            opacity: 0,
          }}
        >
          <span
            style={{
              width: 16,
              fontSize: 11,
              textAlign: "center",
              color: "var(--color-muted)",
              fontFamily: "var(--font-mono)",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
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
              <Link
                href={`/artist/${encodeURIComponent(item.artist)}`}
                style={{ color: "inherit", textDecoration: "none", transition: "opacity 0.12s" }}
              >
                {item.artist}
              </Link>
              {item.album && (
                <Fragment>
                  {" "}
                  <span style={{ opacity: 0.4 }}>·</span>{" "}
                  <Link
                    href={`/album/${encodeURIComponent(item.album)}/${encodeURIComponent(item.artist)}`}
                    style={{ color: "inherit", textDecoration: "none", opacity: 0.7, transition: "opacity 0.12s" }}
                  >
                    {item.album}
                  </Link>
                </Fragment>
              )}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              {fmtTime(item.durationMs)}
            </span>
            <button
              onClick={() => onRemoveFromQueue(item.id)}
              className="btn-icon q-remove"
              style={{ width: 26, height: 26, opacity: 0, transition: "opacity 0.15s" }}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)
