import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { Draft } from "@/lib/database.types";

const statusMap: Record<Draft["status"], { variant: "default" | "success" | "warning" | "info" | "purple"; label: string }> = {
  draft: { variant: "default", label: "Draft" },
  review: { variant: "warning", label: "In Review" },
  scheduled: { variant: "info", label: "Scheduled" },
  published: { variant: "success", label: "Published" },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DraftCard({ id, title, content, status, created_at, word_count, sources_used }: Draft) {
  const s = statusMap[status];
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
