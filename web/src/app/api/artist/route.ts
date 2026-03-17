import { NextRequest, NextResponse } from "next/server";
import { getArtistTracks } from "@/services/deezer";

export async function GET(req: NextRequest) {
    const artist = req.nextUrl.searchParams.get("artist") ?? "";
    if (!artist) return NextResponse.json([]);
    const results = await getArtistTracks(artist);
    return NextResponse.json(results);
}
