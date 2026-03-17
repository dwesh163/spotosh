import { NextRequest, NextResponse } from "next/server";

const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000";

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const res = await fetch(`${MUSIC_SERVER_URL}/history/${id}`, { method: "DELETE" });
  if (res.status === 404) return NextResponse.json({ error: "Not found", code: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true });
};
