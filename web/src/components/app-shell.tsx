"use client";

import { Disc3, ListMusic, Loader2, Search, Sparkles, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Artwork } from "@/components/player/artwork";
import { PlayerControls } from "@/components/player/controls";
import { Progress } from "@/components/player/progress";
import { TrackInfo } from "@/components/player/track-info";
import { VolumeControl } from "@/components/player/volume";
import { DetailOverlay } from "@/components/detail/overlay";
import { GenreChips } from "@/components/queue/genres";
import { QueueList } from "@/components/queue/list";
import { TrackRow } from "@/components/track/row";
import { useControls } from "@/hooks/use-controls";
import { usePlayer } from "@/hooks/use-player";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useSearch } from "@/hooks/use-search";
import type { DetailView, HistoryItem, ItunesTrack, MobileTab } from "@/types/music";

export const AppShell = () => {
  const state = usePlayer();
  const { sendControl, error: ctrlError } = useControls();
  const { query, results, searching, showResults, setShowResults, handleSearch, clearSearch } = useSearch();
  const [muted, setMuted] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("player");
  const [detailView, setDetailView] = useState<DetailView | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { recommendations, recsLoading, removeRecommendation } = useRecommendations({
    history,
    queue: state.queue,
    nowPlaying: state.nowPlaying,
  });

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json() as Promise<HistoryItem[]>)
      .then((data) => setHistory(data))
      .catch(() => {/* silent */});
  }, [state.nowPlaying?.id]);

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
      const secs = ratio * (state.nowPlaying.durationMs / 1000);
      sendControl({ action: "seek", value: secs });
    },
    [sendControl, state.nowPlaying]
  );

  const addToQueue = useCallback(async (track: ItunesTrack) => {
    await fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName ?? "",
        artwork: track.artworkUrl100 ?? "",
        durationMs: track.trackTimeMillis ?? 0,
      }),
    });
    clearSearch();
    setMobileTab("queue");
  }, [clearSearch]);

  const removeFromQueue = useCallback(
    (id: string) => fetch(`/api/queue/${id}`, { method: "DELETE" }),
    []
  );

  const addGenreToQueue = useCallback(async (genreQuery: string) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(genreQuery)}&limit=25`);
      const data = await res.json() as { results: ItunesTrack[] };
      const tracks = data.results.slice(0, 8);
      await Promise.all(
        tracks.map((track) =>
          fetch("/api/queue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              trackId: track.trackId,
              title: track.trackName,
              artist: track.artistName,
              album: track.collectionName ?? "",
              artwork: track.artworkUrl100 ?? "",
              durationMs: track.trackTimeMillis ?? 0,
            }),
          })
        )
      );
      setMobileTab("queue");
    } catch {/* silent */}
  }, []);

  const openDetail = useCallback((detail: DetailView) => setDetailView(detail), []);
  const closeDetail = useCallback(() => setDetailView(null), []);

  const bgArt = state.nowPlaying ? state.nowPlaying.artwork : null;

  return (
    <div
      style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        background: "var(--color-bg)", fontFamily: "var(--font-display)",
        position: "relative", overflow: "hidden",
      }}
    >
      {bgArt && (
        <div
          aria-hidden
          style={{
            position: "absolute", top: -100, left: -100,
            width: 600, height: 600, borderRadius: "50%",
            backgroundImage: `url(${bgArt})`,
            backgroundSize: "cover",
            filter: "blur(130px)", opacity: 0.1,
            pointerEvents: "none", zIndex: 0,
            transition: "background-image 1.5s ease",
          }}
        />
      )}

      <header
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0, position: "relative", zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, background: "var(--color-accent)",
              borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Disc3 size={16} color="#000" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            SPOTOSH
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-muted)", fontSize: 12 }}>
          <Users size={12} />
          <span style={{ fontFamily: "var(--font-mono)" }}>{state.userCount}</span>
        </div>
      </header>

      <div
        className="body-layout"
        style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 5 }}
      >
        <div
          className={`left-panel${mobileTab !== "player" ? " tab-hidden" : ""}`}
          style={{
            width: 380, flexShrink: 0,
            display: "flex", flexDirection: "column",
            padding: 24, gap: 18,
            borderRight: "1px solid var(--color-outline)",
            overflowY: "auto",
          }}
        >
          <Artwork nowPlaying={state.nowPlaying} isPlaying={state.isPlaying} />
          <TrackInfo nowPlaying={state.nowPlaying} onOpenDetail={openDetail} />
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
            {ctrlError ? (
              <p style={{ fontSize: 10, color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>✕ {ctrlError}</p>
            ) : (
              <p style={{ fontSize: 10, color: "var(--color-muted)", opacity: 0.5, fontFamily: "var(--font-mono)" }}>
                {state.connected ? "mpv · ipc ok" : "full track · server audio"}
              </p>
            )}
          </div>
        </div>

        <div
          className={`right-panel${mobileTab !== "queue" ? " tab-hidden" : ""}`}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
        >
          {detailView && (
            <DetailOverlay
              detail={detailView}
              onClose={closeDetail}
              onAdd={addToQueue}
            />
          )}

          <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid var(--color-outline)", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: 13, color: "var(--color-muted)", display: "flex" }}>
                  {searching
                    ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                    : <Search size={15} />
                  }
                </div>
                <input
                  type="text"
                  placeholder="Search catalog…"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => results.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  style={{
                    width: "100%",
                    padding: "11px 38px 11px 38px",
                    borderRadius: 12,
                    background: "var(--color-card)",
                    border: `1px solid ${showResults && results.length > 0 ? "var(--color-accent)" : "var(--color-outline)"}`,
                    color: "var(--color-text)",
                    fontSize: 16,
                    fontFamily: "var(--font-display)",
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                />
                {query && (
                  <button
                    onMouseDown={clearSearch}
                    style={{
                      position: "absolute", right: 11,
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--color-muted)", display: "flex",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {showResults && results.length > 0 && (
                <div
                  className="desktop-dropdown"
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-outline)",
                    borderRadius: 14, overflow: "hidden",
                    zIndex: 50,
                    boxShadow: "0 24px 48px rgba(0,0,0,0.75)",
                    maxHeight: 340, overflowY: "auto",
                    animation: "fade-up 0.18s ease forwards",
                  }}
                >
                  {results.map((track) => (
                    <TrackRow
                      key={track.trackId}
                      track={track}
                      onAdd={addToQueue}
                      onArtistClick={(a) => { setShowResults(false); openDetail({ kind: "artist", name: a }); }}
                      onAlbumClick={(al, a) => { setShowResults(false); openDetail({ kind: "album", name: al, artist: a }); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
            {query.trim() && (
              <div className="mobile-only" style={{ display: "none" }}>
                {searching && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", color: "var(--color-muted)" }}>
                    <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                )}
                {!searching && results.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 8, color: "var(--color-muted)" }}>
                    <Search size={28} strokeWidth={1} />
                    <p style={{ fontSize: 13 }}>No results</p>
                  </div>
                )}
                {results.map((track) => (
                  <TrackRow
                    key={track.trackId}
                    track={track}
                    onAdd={addToQueue}
                    onArtistClick={(a) => openDetail({ kind: "artist", name: a })}
                    onAlbumClick={(al, a) => openDetail({ kind: "album", name: al, artist: a })}
                  />
                ))}
              </div>
            )}

            <div className={query.trim() ? "mobile-hide-when-search" : ""}>
              <GenreChips onSelect={addGenreToQueue} />
              <QueueList state={state} onRemoveFromQueue={removeFromQueue} onOpenDetail={openDetail} />

              {(recommendations.length > 0 || recsLoading) && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--color-outline)" }}>
                    <Sparkles size={13} color="var(--color-muted)" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Recommended
                    </span>
                    {recsLoading && (
                      <Loader2 size={11} style={{ animation: "spin 1s linear infinite", color: "var(--color-muted)", marginLeft: 4 }} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {recommendations.map((track) => (
                      <TrackRow
                        key={track.trackId}
                        track={track}
                        onAdd={addToQueue}
                        onRemove={removeRecommendation}
                        onArtistClick={(a) => openDetail({ kind: "artist", name: a })}
                        onAlbumClick={(al, a) => openDetail({ kind: "album", name: al, artist: a })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="mobile-tabs" style={{ display: "none" }}>
        <button
          className={mobileTab === "player" ? "tab-active" : ""}
          onClick={() => setMobileTab("player")}
        >
          <Disc3 size={18} />
          <span>Player</span>
        </button>
        <button
          className={mobileTab === "queue" ? "tab-active" : ""}
          onClick={() => setMobileTab("queue")}
        >
          <ListMusic size={18} />
          <span>Queue {state.queue.length > 0 && `· ${state.queue.length}`}</span>
        </button>
      </nav>
    </div>
  );
};
