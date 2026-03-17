import { NextRequest, NextResponse } from "next/server";
import { searchTracks } from "@/services/deezer";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    if (!q.trim()) return NextResponse.json([]);
    const results = await searchTracks(q);
    return NextResponse.json(results);
}
