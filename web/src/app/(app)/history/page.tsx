import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { HistoryList } from "@/components/history/list"
import { getHistory } from "@/services/music"

export default async function HistoryPage() {
  const history = await getHistory()

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 24px",
          borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          className="btn-icon"
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={17} />
        </Link>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700 }}>History</p>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
            {history.length} track{history.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px" }}>
        <HistoryList initialHistory={history} />
      </div>
    </div>
  )
}
