"use client"

import { useCallback, useState } from "react"
import { Artwork } from "./artwork"
import { PlayerControls } from "./controls"
import { Progress } from "./progress"
import { TrackInfo } from "./track-info"
import { VolumeControl } from "./volume"
import { useControls } from "@/hooks/use-controls"
import { usePlayer } from "@/hooks/use-player"

export const LeftPanel = () => {
  const state = usePlayer()
  const { sendControl, error } = useControls()
  const [muted, setMuted] = useState(false)

  const togglePlay = useCallback(
    () => sendControl({ action: state.isPlaying ? "pause" : "resume" }),
    [sendControl, state.isPlaying]
  )

  const skipNext = useCallback(() => sendControl({ action: "skip" }), [sendControl])
  const skipBack = useCallback(() => sendControl({ action: "back" }), [sendControl])

  const handleVolume = useCallback(
    (val: number) => {
      setMuted(val === 0)
      sendControl({ action: "volume", value: val })
    },
    [sendControl]
  )

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    sendControl({ action: "volume", value: next ? 0 : state.volume })
  }, [muted, sendControl, state.volume])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!state.nowPlaying) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      sendControl({ action: "seek", value: ratio * (state.nowPlaying.durationMs / 1000) })
    },
    [sendControl, state.nowPlaying]
  )

  return (
    <div
      className="left-panel"
      style={{
        width: 380,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        padding: 24,
        gap: 18,
        borderRight: "1px solid var(--color-outline)",
        overflowY: "auto",
      }}
    >
      <Artwork nowPlaying={state.nowPlaying} isPlaying={state.isPlaying} />
      <TrackInfo nowPlaying={state.nowPlaying} />
      <Progress nowPlaying={state.nowPlaying} progressMs={state.progressMs} onSeek={handleSeek} />
      <PlayerControls
        nowPlaying={state.nowPlaying}
        isPlaying={state.isPlaying}
        onTogglePlay={togglePlay}
        onSkipBack={skipBack}
        onSkipNext={skipNext}
      />
      <VolumeControl
        volume={state.volume}
        muted={muted}
        onVolumeChange={handleVolume}
        onToggleMute={toggleMute}
      />
      <div style={{ minHeight: 16, textAlign: "center" }}>
        {error ? (
          <p style={{ fontSize: 10, color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>✕ {error}</p>
        ) : (
          <p style={{ fontSize: 10, color: "var(--color-muted)", opacity: 0.5, fontFamily: "var(--font-mono)" }}>
            {state.connected ? `mpv · ipc ok · ${state.userCount} online` : "connecting…"}
          </p>
        )}
      </div>
    </div>
  )
}
