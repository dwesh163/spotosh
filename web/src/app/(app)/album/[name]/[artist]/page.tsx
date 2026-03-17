import { ArrowLeft, Disc } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrackList } from "@/components/detail/track-list";
import { getAlbumTracks } from "@/services/deezer";

type Props = { params: Promise<{ name: string; artist: string }> };

export default async function AlbumPage({ params }: Props) {
    const { name, artist: artistParam } = await params;
    const album = decodeURIComponent(name);
    const artist = decodeURIComponent(artistParam);
    const tracks = await getAlbumTracks(album, artist);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-[18px] border-b border-outline shrink-0">
                <Button variant="icon" size="icon-sm" asChild>
                    <Link href="/">
                        <ArrowLeft size={17} />
                    </Link>
                </Button>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                        {album}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">Album · {artist}</p>
                </div>
                <Disc size={18} className="text-muted" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-3.5">
                <TrackList tracks={tracks} />
            </div>
        </div>
    );
}
