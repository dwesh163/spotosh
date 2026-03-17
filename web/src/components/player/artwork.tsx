import { Fragment } from "react";
import { Disc3 } from "lucide-react";
import { bigArt } from "@/lib/utils";
import type { QueueItem } from "@/types/music";

type ArtworkProps = {
  nowPlaying: QueueItem | null;
  isPlaying: boolean;
};

export const Artwork = ({ nowPlaying, isPlaying }: ArtworkProps) => (
  <div className="art-wrap relative aspect-square rounded-[18px] overflow-hidden bg-card shrink-0">
    {nowPlaying ? (
      <Fragment>
        <div
          aria-hidden
          className="absolute inset-[-20px] bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${bigArt(nowPlaying.artwork)})`,
            filter: "blur(50px)",
            opacity: 0.45,
          }}
        />
        <img
          src={bigArt(nowPlaying.artwork)}
          alt={nowPlaying.album}
          className="relative w-full h-full object-cover animate-pop-in"
        />
      </Fragment>
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted">
        <Disc3 size={56} strokeWidth={1} />
        <span className="text-[13px]">Nothing playing</span>
      </div>
    )}

    {isPlaying && (
      <div className="absolute bottom-2.5 right-2.5 flex gap-[3px] items-end px-2 py-1.5 rounded-[9px] bg-black/55 backdrop-blur-sm">
        {(["eq1", "eq2", "eq3"] as const).map((anim, i) => (
          <div
            key={anim}
            className="w-[3px] rounded-sm bg-accent"
            style={{
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
