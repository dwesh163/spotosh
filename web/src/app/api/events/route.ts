const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000";

export const GET = async (request: Request) => {
  const upstream = await fetch(`${MUSIC_SERVER_URL}/events`, {
    headers: { Accept: "text/event-stream" },
    signal: request.signal,
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};
