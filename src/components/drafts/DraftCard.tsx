import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { Draft } from "@/lib/database.types";
import { DRAFT_STATUS_MAP } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function DraftCard({ id, title, content, status, created_at, word_count, sources_used }: Draft) {
  const s = DRAFT_STATUS_MAP[status] || { variant: "default" as const, label: status };
  const preview = content ? content.replace(/^#.*\n/gm, "").trim().slice(0, 150) + "..." : "No content yet";

  return (
    <Link href={`/dashboard/drafts/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={s.variant}>{s.label}</Badge>
            </div>
            <h3 className="text-base font-semibold text-gray-900 leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{preview}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
          <span>{formatDate(created_at)}</span>
          <span>{word_count} words</span>
          <span>{sources_used} sources</span>
        </div>
      </Card>
    </Link>
  );
}
