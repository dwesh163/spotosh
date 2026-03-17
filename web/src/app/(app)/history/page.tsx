import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HistoryList } from "@/components/history/list";
import { getHistory } from "@/services/music";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-[18px] border-b border-outline shrink-0">
        <Button variant="icon" size="icon-sm" asChild>
          <Link href="/">
            <ArrowLeft size={17} />
          </Link>
        </Button>
        <div>
          <p className="text-[15px] font-bold">History</p>
          <p className="text-[11px] text-muted mt-0.5">
            {history.length} track{history.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-3.5">
        <HistoryList initialHistory={history} />
      </div>
    </div>
  );
}
