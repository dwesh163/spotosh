import type { Track } from "@/types/music";
import { getTrackCover } from "@/services/deezer";

const API_KEY = process.env.LASTFM_API_KEY ?? "";
const BASE = "https://ws.audioscrobbler.com/2.0/";

type LastfmImage = { size: string; "#text": string };
type LastfmTrack = {
    name: string;
    artist: string | { name: string };
    duration?: string | number;
    image?: LastfmImage[];
};

const lfm = async (params: Record<string, string>): Promise<unknown> => {
    const url = new URL(BASE);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("format", "json");
    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
    });
    return res.json();
};

const stableId = (name: string, artist: string): number =>
    Math.abs([...`${name}:${artist}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));

const largeImage = (images: LastfmImage[] | undefined): string =>
    images?.find((i) => i.size === "extralarge")?.["#text"] ?? "";

const artistName = (artist: LastfmTrack["artist"]): string =>
    typeof artist === "string" ? artist : artist.name;

const toTrack = (t: LastfmTrack, collection = ""): Track => ({
    trackId: stableId(t.name, artistName(t.artist)),
    trackName: t.name,
    artistName: artistName(t.artist),
    collectionName: collection,
    artworkUrl100: largeImage(t.image),
    previewUrl: "",
    trackTimeMillis: Number(t.duration ?? 0) * 1000,
});

export const getSimilarTracks = async (artist: string, track: string): Promise<Track[]> => {
    try {
        const data = (await lfm({ method: "track.getSimilar", artist, track, limit: "15" })) as {
            similartracks?: { track?: LastfmTrack[] };
        };
        const tracks = data?.similartracks?.track ?? [];
        if (!Array.isArray(tracks)) return [];
        const base = tracks.slice(0, 10).map((t) => toTrack(t));
        const covers = await Promise.all(
            base.map((t) => getTrackCover(t.artistName, t.trackName))
        );
        return base.map((t, i) => covers[i] ? { ...t, artworkUrl100: covers[i] } : t);
    } catch {
        return [];
    }
};
