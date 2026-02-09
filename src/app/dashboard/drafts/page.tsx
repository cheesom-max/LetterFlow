"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import DraftCard from "@/components/drafts/DraftCard";
import { useDrafts } from "@/hooks/useDrafts";

const statusOptions = [
  { label: "All", value: "All" },
  { label: "Draft", value: "draft" },
  { label: "In Review", value: "review" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
];

export default function DraftsPage() {
  const { drafts, loading, statusFilter, setStatusFilter } = useDrafts();
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {drafts.length} drafts &middot;{" "}
            {drafts.filter((d) => d.status === "draft").length} in progress
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/feed")}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate Draft
        </Button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value === "All" ? "All" : opt.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === opt.value || (statusFilter === "All" && opt.value === "All")
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No drafts yet</h3>
          <p className="text-sm text-gray-500 mb-6">Go to the Feed page to curate articles and generate your first draft.</p>
          <Button onClick={() => router.push("/dashboard/feed")}>Go to Feed</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} {...draft} />
          ))}
        </div>
      )}
    </div>
  );
}
