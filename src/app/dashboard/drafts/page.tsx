import Button from "@/components/ui/Button";
import DraftCard from "@/components/drafts/DraftCard";
import { drafts } from "@/data/dummy";

export default function DraftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {drafts.length} drafts &middot;{" "}
            {drafts.filter((d) => d.status === "draft").length} in progress
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate Draft
        </Button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Draft", "In Review", "Scheduled", "Published"].map((status) => (
          <button
            key={status}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === "All"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {drafts.map((draft) => (
          <DraftCard key={draft.id} {...draft} />
        ))}
      </div>
    </div>
  );
}
