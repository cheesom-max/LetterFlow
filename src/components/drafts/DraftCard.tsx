import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Draft } from "@/data/dummy";

const statusMap: Record<Draft["status"], { variant: "default" | "success" | "warning" | "info" | "purple"; label: string }> = {
  draft: { variant: "default", label: "Draft" },
  review: { variant: "warning", label: "In Review" },
  scheduled: { variant: "info", label: "Scheduled" },
  published: { variant: "success", label: "Published" },
};

export default function DraftCard({ id, title, preview, status, createdAt, wordCount, sourcesUsed }: Draft) {
  const s = statusMap[status];

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
          <span>{createdAt}</span>
          <span>{wordCount} words</span>
          <span>{sourcesUsed} sources</span>
        </div>
      </Card>
    </Link>
  );
}
