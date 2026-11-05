"use client";

import { Disc3 } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/hooks/use-player";
import { bigArt, fmtTime } from "@/lib/utils";

export default function DisplayPage() {
  const { nowPlaying, queue, progressMs, isPlaying, connected } = usePlayer();
  const next = queue[0] ?? null;
  const progress = nowPlaying ? Math.min(1, progressMs / (nowPlaying.durationMs || 30_000)) : 0;

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-bg font-display text-foreground flex flex-col p-[4vmin] gap-[4vmin]">
      {nowPlaying && (
        <div
          aria-hidden
          className="absolute inset-[-10%] bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${bigArt(nowPlaying.artwork)})`,
            filter: "blur(60px)",
            opacity: 0.35,
          }}
        />
      )}

      <section className="relative flex-1 min-h-0 flex items-center gap-[5vmin] portrait:flex-col portrait:justify-center portrait:text-center">
        <div className="relative h-full max-h-full aspect-square portrait:h-auto portrait:w-full portrait:max-w-[70vh] rounded-[3vmin] overflow-hidden bg-card shrink-0 shadow-2xl">
          {nowPlaying ? (
            <Image
              key={nowPlaying.id}
              src={bigArt(nowPlaying.artwork)}
              alt={nowPlaying.album}
              fill
              priority
              sizes="60vmin"
              className="object-cover animate-pop-in"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Disc3 className="w-1/3 h-1/3" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 portrait:flex-none portrait:w-full flex flex-col justify-center gap-[2vmin]">
          <p className="text-[2.6vmin] font-mono uppercase tracking-[0.2em] text-accent">
            {nowPlaying
              ? isPlaying
                ? "En cours"
                : "En pause"
              : connected
                ? "Rien en lecture"
                : "Connexion…"}
          </p>
          <h1
            key={nowPlaying?.id}
            className="text-[8vmin] font-extrabold leading-[1.05] line-clamp-2 break-words animate-fade-up"
          >
            {nowPlaying?.title ?? "—"}
          </h1>
          <p className="text-[4.5vmin] text-muted truncate">{nowPlaying?.artist ?? ""}</p>

          <div className="mt-[2vmin]">
            <div className="h-[1.2vmin] rounded-full bg-muted-2 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-[width] duration-500 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[2.6vmin] text-muted font-mono mt-[1vmin]">
              <span>{fmtTime(progressMs)}</span>
              <span>{fmtTime(nowPlaying?.durationMs ?? 0)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative shrink-0 flex items-center gap-[3vmin] rounded-[2.5vmin] bg-black/35 backdrop-blur-md p-[2.5vmin]">
        <span className="text-[2.6vmin] font-mono uppercase tracking-[0.2em] text-muted shrink-0">
          Ensuite
        </span>
        {next ? (
          <>
            <div className="relative h-[11vmin] w-[11vmin] rounded-[1.5vmin] overflow-hidden bg-card shrink-0">
              <Image
                src={next.artwork}
                alt={next.album}
                fill
                sizes="15vmin"
                className="object-cover"
              />
            </div>
            <div key={next.id} className="min-w-0 animate-fade-up">
              <p className="text-[4.2vmin] font-bold leading-tight truncate">{next.title}</p>
              <p className="text-[3.2vmin] text-muted truncate">{next.artist}</p>
            </div>
          </>
        ) : (
          <p className="text-[3.6vmin] text-muted">File d'attente vide</p>
        )}
      </section>
    </div>
  );
}
