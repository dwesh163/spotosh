"use client";

import { useCallback, useState } from "react";
import { Artwork } from "./artwork";
import { PlayerControls } from "./controls";
import { Progress } from "./progress";
import { TrackInfo } from "./track-info";
import { VolumeControl } from "./volume";
import { useControls } from "@/hooks/use-controls";
import { usePlayer } from "@/hooks/use-player";

export const LeftPanel = () => {
  const state = usePlayer();
  const { sendControl, error } = useControls();
  const [muted, setMuted] = useState(false);

  const togglePlay = useCallback(
    () => sendControl({ action: state.isPlaying ? "pause" : "resume" }),
    [sendControl, state.isPlaying]
  );

  const skipNext = useCallback(() => sendControl({ action: "skip" }), [sendControl]);
  const skipBack = useCallback(() => sendControl({ action: "back" }), [sendControl]);

  const handleVolume = useCallback(
    (val: number) => {
      setMuted(val === 0);
      sendControl({ action: "volume", value: val });
    },
    [sendControl]
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    sendControl({ action: "volume", value: next ? 0 : state.volume });
  }, [muted, sendControl, state.volume]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!state.nowPlaying) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      sendControl({ action: "seek", value: ratio * (state.nowPlaying.durationMs / 1000) });
    },
    [sendControl, state.nowPlaying]
  );

  return (
    <div className="left-panel w-[380px] shrink-0 flex flex-col p-6 gap-[18px] border-r border-outline overflow-y-auto">
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
      <div className="min-h-4 text-center">
        {error ? (
          <p className="text-[10px] text-[#ff6b6b] font-mono">✕ {error}</p>
        ) : (
          <p className="text-[10px] text-muted opacity-50 font-mono">
            {state.connected ? `mpv · ipc ok · ${state.userCount} online` : "connecting…"}
          </p>
        )}
      </div>
    </div>
  );
};
