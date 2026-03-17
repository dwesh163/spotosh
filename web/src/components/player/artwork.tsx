import { Fragment } from "react";
import { Disc3 } from "lucide-react";
import { bigArt } from "@/lib/utils";
import type { QueueItem } from "@/types/music";

type ArtworkProps = {
  nowPlaying: QueueItem | null;
  isPlaying: boolean;
};

export const Artwork = ({ nowPlaying, isPlaying }: ArtworkProps) => (
  <div
    className="art-wrap"
    style={{
      position: "relative", aspectRatio: "1",
      borderRadius: 18, overflow: "hidden",
      background: "var(--color-card)", flexShrink: 0,
    }}
  >
    {nowPlaying ? (
      <Fragment>
        <div
          aria-hidden
          style={{
            position: "absolute", inset: -20,
            backgroundImage: `url(${bigArt(nowPlaying.artwork)})`,
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "blur(50px)", opacity: 0.45, transform: "scale(1.1)",
          }}
        />
        <img
          src={bigArt(nowPlaying.artwork)}
          alt={nowPlaying.album}
          style={{
            position: "relative", width: "100%", height: "100%", objectFit: "cover",
            animation: "pop-in 0.4s ease forwards",
          }}
        />
      </Fragment>
    ) : (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 12, color: "var(--color-muted)",
        }}
      >
        <Disc3 size={56} strokeWidth={1} />
        <span style={{ fontSize: 13 }}>Nothing playing</span>
      </div>
    )}

    {isPlaying && (
      <div
        style={{
          position: "absolute", bottom: 10, right: 10,
          display: "flex", gap: 3, alignItems: "flex-end",
          padding: "6px 8px", borderRadius: 9,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
        }}
      >
        {(["eq1", "eq2", "eq3"] as const).map((anim, i) => (
          <div
            key={anim}
            style={{
              width: 3, borderRadius: 2, background: "var(--color-accent)",
              height: 8,
              animation: `${anim} 0.7s ease infinite alternate`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    )}
  </div>
);
