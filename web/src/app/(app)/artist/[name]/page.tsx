import { ArrowLeft, Music2 } from "lucide-react"
import Link from "next/link"
import { TrackList } from "@/components/detail/track-list"
import { getArtistTracks } from "@/services/lastfm"

type Props = { params: Promise<{ name: string }> }

export default async function ArtistPage({ params }: Props) {
  const { name } = await params
  const artist = decodeURIComponent(name)
  const tracks = await getArtistTracks(artist)

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
            {artist}
          </p>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
            Artist · {tracks.length} top tracks
          </p>
        </div>
        <Music2 size={18} color="var(--color-muted)" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        <TrackList tracks={tracks} />
      </div>
    </div>
  )
}
