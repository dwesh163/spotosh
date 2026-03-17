import { NextRequest, NextResponse } from "next/server";

const LASTFM_KEY = process.env.LASTFM_API_KEY ?? "";

type LastFmTrack = { name: string; artist: { name: string } };
type LastFmResponse = { similartracks?: { track?: LastFmTrack[] } };

export const GET = async (req: NextRequest) => {
  const artist = req.nextUrl.searchParams.get("artist") ?? "";
  const track = req.nextUrl.searchParams.get("track") ?? "";

  if (!artist || !track)
    return NextResponse.json({ error: "artist and track are required", code: "VALIDATION_ERROR" }, { status: 400 });

  if (!LASTFM_KEY)
    return NextResponse.json({ error: "LASTFM_API_KEY not configured", code: "CONFIGURATION_ERROR" }, { status: 503 });

  const lfmUrl = [
    "https://ws.audioscrobbler.com/2.0/?method=track.getSimilar",
    `artist=${encodeURIComponent(artist)}`,
    `track=${encodeURIComponent(track)}`,
    `api_key=${LASTFM_KEY}`,
    "format=json",
    "limit=15",
    "autocorrect=1",
  ].join("&");

  const lfmRes = await fetch(lfmUrl);
  const lfmData = await lfmRes.json() as LastFmResponse;
  const similar = lfmData?.similartracks?.track ?? [];

  if (!similar.length) return NextResponse.json([]);

  const results = await Promise.all(
    similar.slice(0, 12).map(async (t) => {
      try {
        const term = `${t.artist.name} ${t.name}`;
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=1`
        );
        const data = await res.json() as { results?: unknown[] };
        const hit = data.results?.[0];
        return hit ?? null;
      } catch {
        return null;
      }
    })
  );

  return NextResponse.json(results.filter(Boolean));
};
