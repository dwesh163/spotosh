import { NextRequest, NextResponse } from "next/server";
import { getSimilarTracks } from "@/services/lastfm";

export async function GET(req: NextRequest) {
    const artist = req.nextUrl.searchParams.get("artist") ?? "";
    const track = req.nextUrl.searchParams.get("track") ?? "";
    if (!artist || !track) return NextResponse.json([]);
    const results = await getSimilarTracks(artist, track);
    return NextResponse.json(results);
}
