import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getGenreChartTracks } from "@/services/deezer";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const genreId = id ? parseInt(id, 10) : NaN;
  if (isNaN(genreId)) return NextResponse.json([]);
  const results = await getGenreChartTracks(genreId);
  return NextResponse.json(results);
}
