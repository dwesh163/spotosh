"use server"

import type { ItunesTrack } from "@/types/music"

const API_KEY = process.env.LASTFM_API_KEY ?? ""
const BASE = "https://ws.audioscrobbler.com/2.0/"

type LastfmImage = { size: string; "#text": string }
type LastfmTrack = {
  name: string
  artist: string | { name: string }
  duration?: string | number
  image?: LastfmImage[]
}

const lfm = async (params: Record<string, string>): Promise<unknown> => {
  const url = new URL(BASE)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  url.searchParams.set("api_key", API_KEY)
  url.searchParams.set("format", "json")
  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  return res.json()
}

const stableId = (name: string, artist: string): number =>
  Math.abs([...`${name}:${artist}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))

const largeImage = (images: LastfmImage[] | undefined): string =>
  images?.find((i) => i.size === "extralarge")?.["#text"] ?? ""

const artworkFromItunes = async (artist: string, track: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${track}`)}&entity=song&limit=1`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json() as { results?: Array<{ artworkUrl100?: string }> }
    return data.results?.[0]?.artworkUrl100 ?? ""
  } catch {
    return ""
  }
}

const artistName = (artist: LastfmTrack["artist"]): string =>
  typeof artist === "string" ? artist : artist.name

const toTrack = async (t: LastfmTrack, collection = ""): Promise<ItunesTrack> => {
  const name = t.name
  const artist = artistName(t.artist)
  const artwork = largeImage(t.image) || await artworkFromItunes(artist, name)
  return {
    trackId: stableId(name, artist),
    trackName: name,
    artistName: artist,
    collectionName: collection,
    artworkUrl100: artwork,
    previewUrl: "",
    trackTimeMillis: Number(t.duration ?? 0) * 1000,
  }
}

export const searchTracks = async (q: string): Promise<ItunesTrack[]> => {
  try {
    const data = await lfm({ method: "track.search", track: q, limit: "20" }) as {
      results?: { trackmatches?: { track?: LastfmTrack[] } }
    }
    const tracks = data?.results?.trackmatches?.track ?? []
    if (!Array.isArray(tracks)) return []
    return Promise.all(tracks.slice(0, 12).map((t) => toTrack(t)))
  } catch {
    return []
  }
}

export const getArtistTracks = async (artist: string): Promise<ItunesTrack[]> => {
  try {
    const data = await lfm({ method: "artist.getTopTracks", artist, limit: "20" }) as {
      toptracks?: { track?: LastfmTrack[] }
    }
    const tracks = data?.toptracks?.track ?? []
    if (!Array.isArray(tracks)) return []
    return Promise.all(tracks.slice(0, 20).map((t) => toTrack(t)))
  } catch {
    return []
  }
}

export const getAlbumTracks = async (album: string, artist: string): Promise<ItunesTrack[]> => {
  try {
    const data = await lfm({ method: "album.getInfo", album, artist }) as {
      album?: { tracks?: { track?: LastfmTrack[] }; image?: LastfmImage[] }
    }
    const tracks = data?.album?.tracks?.track ?? []
    const albumArt = largeImage(data?.album?.image)
    if (!Array.isArray(tracks)) return []
    return tracks.map((t): ItunesTrack => ({
      trackId: stableId(t.name, artist),
      trackName: t.name,
      artistName: artistName(t.artist),
      collectionName: album,
      artworkUrl100: albumArt,
      previewUrl: "",
      trackTimeMillis: Number(t.duration ?? 0) * 1000,
    }))
  } catch {
    return []
  }
}

export const getSimilarTracks = async (artist: string, track: string): Promise<ItunesTrack[]> => {
  try {
    const data = await lfm({ method: "track.getSimilar", artist, track, limit: "15" }) as {
      similartracks?: { track?: LastfmTrack[] }
    }
    const tracks = data?.similartracks?.track ?? []
    if (!Array.isArray(tracks)) return []
    return Promise.all(tracks.slice(0, 10).map((t) => toTrack(t)))
  } catch {
    return []
  }
}
