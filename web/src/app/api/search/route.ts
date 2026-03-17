import { NextRequest, NextResponse } from "next/server";
import type { ItunesTrack } from "@/types/music";

type ItunesResponse = {
  results?: ItunesTrack[];
};

export const GET = async (req: NextRequest) => {
  const q = req.nextUrl.searchParams.get("q");
  const limit = req.nextUrl.searchParams.get("limit") ?? "20";
  if (!q) return NextResponse.json({ results: [] });

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json() as ItunesResponse;
  const results = (data.results ?? []).filter((t) => t.previewUrl);

  return NextResponse.json({ results });
};
