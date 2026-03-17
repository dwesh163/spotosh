import { ArrowLeft, Disc } from "lucide-react"
import Link from "next/link"
import { TrackList } from "@/components/detail/track-list"
import { getAlbumTracks } from "@/services/lastfm"

type Props = { params: Promise<{ name: string; artist: string }> }

export default async function AlbumPage({ params }: Props) {
  const { name, artist: artistParam } = await params
  const album = decodeURIComponent(name)
  const artist = decodeURIComponent(artistParam)
  const tracks = await getAlbumTracks(album, artist)

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 24px",
          borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          className="btn-icon"
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={17} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {album}
          </p>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
            Album · {artist}
          </p>
        </div>
        <Disc size={18} color="var(--color-muted)" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        <TrackList tracks={tracks} />
      </div>
    </div>
  )
}
