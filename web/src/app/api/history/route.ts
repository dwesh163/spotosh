import { NextResponse } from "next/server";

const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000";

export const GET = async () => {
  const res = await fetch(`${MUSIC_SERVER_URL}/history`, { cache: "no-store" });
  const data = await res.json() as unknown;
  return NextResponse.json(data);
};
