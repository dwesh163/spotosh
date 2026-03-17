import { Disc3 } from "lucide-react";
import { signInWithGitHub } from "./actions";

export default function LoginPage() {
  return (
    <div className="h-screen flex bg-bg font-display overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Glow blob */}
        <div className="absolute w-96 h-96 rounded-full bg-accent opacity-10 blur-3xl pointer-events-none" />
        {/* Grid of discs */}
        <div className="grid grid-cols-4 gap-6 opacity-10 rotate-12 scale-125">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-2xl bg-outline flex items-center justify-center"
            >
              <Disc3 size={22} className="text-muted" />
            </div>
          ))}
        </div>
        {/* Brand watermark */}
        <p className="absolute bottom-10 left-10 text-xs tracking-widest uppercase text-muted opacity-30 font-bold">
          SPOTOSH
        </p>
      </div>

      {/* Right login panel */}
      <div className="w-full lg:w-96 flex flex-col items-center justify-center px-10 bg-surface border-l border-outline relative">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        <div className="w-full max-w-xs flex flex-col gap-10 animate-pop-in">
          {/* Logo + title */}
          <div className="flex flex-col gap-5">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(181,255,71,0.35)]">
              <Disc3 size={22} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-wider uppercase text-foreground leading-none">
                SPOTOSH
              </h1>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Your shared music experience.
                <br />
                Sign in to continue.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-outline" />

          {/* Auth */}
          <div className="flex flex-col gap-4">
            <form action={signInWithGitHub}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 p-4! rounded-xl bg-accent text-black text-sm font-bold tracking-[0.04em] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(181,255,71,0.2)] cursor-pointer"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </form>

            <p className="text-xs text-muted text-center opacity-50">
              Access is restricted to authorized users only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
