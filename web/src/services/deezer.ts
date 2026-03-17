import type { Track } from "@/types/music";

const BASE = "https://api.deezer.com";

const deezer = async (path: string, params?: Record<string, string>): Promise<unknown> => {
    const url = new URL(`${BASE}${path}`);
    if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`[deezer] ${path} failed (${res.status})`);
    return res.json();
};

const stableId = (id: number): number => id;

type DeezerTrack = {
    id: number;
    title: string;
    artist: { name: string };
    album: { title: string; cover_big: string };
    duration: number;
    preview: string;
};

const toTrack = (t: DeezerTrack): Track => ({
    trackId: stableId(t.id),
    trackName: t.title,
    artistName: t.artist.name,
    collectionName: t.album.title,
    artworkUrl100: t.album.cover_big,
    previewUrl: t.preview,
    trackTimeMillis: t.duration * 1000,
});

export const searchTracks = async (q: string): Promise<Track[]> => {
    try {
        const data = (await deezer("/search", { q, limit: "20" })) as {
            data?: DeezerTrack[];
            error?: { message: string };
        };
        if (data?.error) {
            console.error("[deezer] searchTracks error:", data.error.message);
            return [];
        }
        return (data?.data ?? []).slice(0, 12).map(toTrack);
    } catch (e) {
        console.error("[deezer] searchTracks threw:", e);
        return [];
    }
};

export const getArtistTracks = async (artist: string): Promise<Track[]> => {
    try {
        const search = (await deezer("/search/artist", { q: artist, limit: "1" })) as {
            data?: { id: number }[];
        };
        const artistId = search?.data?.[0]?.id;
        if (!artistId) return [];
        const data = (await deezer(`/artist/${artistId}/top`, { limit: "20" })) as {
            data?: DeezerTrack[];
        };
        return (data?.data ?? []).map(toTrack);
    } catch (e) {
        console.error("[deezer] getArtistTracks threw:", e);
        return [];
    }
};

export const getAlbumTracks = async (album: string, artist: string): Promise<Track[]> => {
    try {
        const search = (await deezer("/search/album", { q: `${artist} ${album}`, limit: "1" })) as {
            data?: { id: number; title: string; cover_big: string }[];
        };
        const albumItem = search?.data?.[0];
        if (!albumItem) return [];
        const data = (await deezer(`/album/${albumItem.id}/tracks`)) as {
            data?: Omit<DeezerTrack, "album">[];
        };
        return (data?.data ?? []).map((t) =>
            toTrack({ ...t, album: { title: albumItem.title, cover_big: albumItem.cover_big } })
        );
    } catch (e) {
        console.error("[deezer] getAlbumTracks threw:", e);
        return [];
    }
};
