"use client";

import Badge from "@/components/ui/Badge";
import type { Article } from "@/lib/database.types";

interface FeedCardProps {
  article: Article & { topic_name: string };
  onBookmark: (id: string) => void;
  onAddToDraft?: (id: string) => void;
}

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

export default function FeedCard({ article, onBookmark, onAddToDraft }: FeedCardProps) {
  const scoreColor =
    article.relevance_score >= 90
      ? "from-emerald-500 to-teal-500 text-white"
      : article.relevance_score >= 80
        ? "from-blue-500 to-cyan-500 text-white"
        : "from-gray-100 to-gray-200 text-gray-600";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="purple">{article.topic_name || "Uncategorized"}</Badge>
            <span className="text-xs text-gray-400">
              {article.published_at ? formatDate(article.published_at) : ""}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {article.summary}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded-full" />
            <span className="text-xs font-medium text-gray-500">{article.source}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-md`}>
            <span className="text-sm font-extrabold">{article.relevance_score}</span>
          </div>
          <button
            onClick={() => onBookmark(article.id)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              article.is_bookmarked
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-50"
            }`}
          >
            <svg className="w-5 h-5" fill={article.is_bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5">
        <button
          onClick={() => onAddToDraft?.(article.id)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
        >
          Add to Draft
        </button>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
        >
          View Original
        </a>
      </div>
    </div>
  );
}
