import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPlaylistTracks } from "@/services/deezer";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const playlistId = id ? parseInt(id, 10) : NaN;
  if (isNaN(playlistId)) return NextResponse.json([]);
  const results = await getPlaylistTracks(playlistId);
  return NextResponse.json(results);
}
