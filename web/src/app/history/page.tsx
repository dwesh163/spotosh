import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HistoryList } from "@/components/history/list";
import type { HistoryItem } from "@/types/music";

const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000";

const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const res = await fetch(`${MUSIC_SERVER_URL}/history`, { cache: "no-store" });
    return res.json() as Promise<HistoryItem[]>;
  } catch {
    return [];
  }
};

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div
      style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        background: "var(--color-bg)", fontFamily: "var(--font-display)",
        color: "var(--color-text)",
      }}
    >
      <header
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "18px 24px", borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          className="btn-icon"
          style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
        >
          <ArrowLeft size={17} />
        </Link>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700 }}>History</p>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
            {history.length} track{history.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        <HistoryList initialHistory={history} />
      </div>
    </div>
  );
}
