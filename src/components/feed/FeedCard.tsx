import Badge from "@/components/ui/Badge";
import { FeedArticle } from "@/data/dummy";

export default function FeedCard({
  title,
  summary,
  source,
  relevanceScore,
  publishedAt,
  category,
  isBookmarked,
}: FeedArticle) {
  const scoreColor =
    relevanceScore >= 90
      ? "from-emerald-500 to-teal-500 text-white"
      : relevanceScore >= 80
        ? "from-blue-500 to-cyan-500 text-white"
        : "from-gray-100 to-gray-200 text-gray-600";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="purple">{category}</Badge>
            <span className="text-xs text-gray-400">{publishedAt}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {summary}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <span className="text-xs font-medium text-gray-500">{source}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-md`}>
            <span className="text-sm font-extrabold">{relevanceScore}</span>
          </div>
          <button
            className={`p-1.5 rounded-lg transition-all ${
              isBookmarked
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-50"
            }`}
          >
            <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5">
        {["Add to Draft", "View Original", "Summarize"].map((action) => (
          <button
            key={action}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
