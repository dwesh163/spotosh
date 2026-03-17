import { Disc3, History, LogOut } from "lucide-react"
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { LeftPanel } from "@/components/player/left-panel"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
        fontFamily: "var(--font-display)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid var(--color-outline)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--color-accent)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Disc3 size={16} color="#000" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            SPOTOSH
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/history"
            className="btn-icon"
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
            title="History"
          >
            <History size={15} />
          </Link>

          {session?.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? "User"}
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
            />
          )}

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button type="submit" className="btn-icon" style={{ width: 32, height: 32 }} title="Sign out">
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftPanel />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
