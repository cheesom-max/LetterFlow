import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FeedCard from "@/components/feed/FeedCard";
import { feedArticles } from "@/data/dummy";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {feedArticles.length} articles curated today
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <Input
              placeholder="Filter articles..."
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "AI & Machine Learning", "Creator Economy", "SaaS Growth", "Web Development"].map(
          (cat) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                cat === "All"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {feedArticles.map((article) => (
          <FeedCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}
