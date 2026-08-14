import { Disc3, History, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LeftPanel } from "@/components/player/left-panel";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/services/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="h-[100dvh] flex flex-col bg-bg font-display overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-outline shrink-0 z-10">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-foreground">
          <div className="w-8 h-8 bg-accent rounded-[9px] flex items-center justify-center">
            <Disc3 size={16} color="#000" />
          </div>
          <span className="text-base font-extrabold tracking-[0.14em] uppercase">SPOTOSH</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="icon" size="icon-sm" asChild>
            <Link href="/history" title="History">
              <History size={15} />
            </Link>
          </Button>

          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          )}

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="icon" size="icon-sm" type="submit" title="Sign out">
              <LogOut size={15} />
            </Button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
