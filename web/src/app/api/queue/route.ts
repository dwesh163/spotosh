import { NextRequest, NextResponse } from "next/server";

const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000";

export const GET = async () => {
  const res = await fetch(`${MUSIC_SERVER_URL}/queue`, { cache: "no-store" });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json() as unknown;
  const res = await fetch(`${MUSIC_SERVER_URL}/queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as unknown;
  return NextResponse.json(data, { status: res.status });
};
