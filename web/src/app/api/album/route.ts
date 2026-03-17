import { NextRequest, NextResponse } from "next/server";
import { getAlbumTracks } from "@/services/deezer";

export async function GET(req: NextRequest) {
    const album = req.nextUrl.searchParams.get("album") ?? "";
    const artist = req.nextUrl.searchParams.get("artist") ?? "";
    if (!album || !artist) return NextResponse.json([]);
    const results = await getAlbumTracks(album, artist);
    return NextResponse.json(results);
}
