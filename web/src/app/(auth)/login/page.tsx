import { Disc3 } from "lucide-react"
import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        fontFamily: "var(--font-display)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "40px 36px",
          borderRadius: 20,
          background: "var(--color-surface)",
          border: "1px solid var(--color-outline)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          animation: "pop-in 0.3s ease forwards",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "var(--color-accent)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Disc3 size={26} color="#000" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text)",
              }}
            >
              SPOTOSH
            </p>
            <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 6 }}>
              Shared music experience
            </p>
          </div>
        </div>

        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/" })
          }}
          style={{ width: "100%" }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "13px 20px",
              borderRadius: 12,
              background: "var(--color-accent)",
              border: "none",
              cursor: "pointer",
              color: "#000",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              letterSpacing: "0.04em",
              transition: "opacity 0.15s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </form>

        <p style={{ fontSize: 11, color: "var(--color-muted)", textAlign: "center", opacity: 0.6 }}>
          Access is restricted to authorized users only.
        </p>
      </div>
    </div>
  )
}
