"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FeedCard from "@/components/feed/FeedCard";
import Modal from "@/components/ui/Modal";
import { useArticles } from "@/hooks/useArticles";
import { useTopics } from "@/hooks/useTopics";
import { useUser } from "@/hooks/useUser";

export default function FeedPage() {
  const { articles, categories, loading, filters, setFilters, toggleBookmark, curate, curateLoading } = useArticles();
  const { topics } = useTopics();
  const { user } = useUser();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [curateModalOpen, setCurateModalOpen] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const handleCurate = async (topicId: string) => {
    setCurateModalOpen(false);
    await curate(topicId);
  };

  const handleGenerateDraft = async () => {
    if (!user || selectedArticles.length === 0) return;
    const res = await fetch("/api/generate-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, articleIds: selectedArticles }),
    });
    if (res.ok) {
      const { draft } = await res.json();
      router.push(`/dashboard/drafts/${draft.id}`);
    }
  };

  const toggleSelectArticle = (id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const allCategories = ["All", ...categories];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {articles.length} articles curated
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <Input
              placeholder="Filter articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <Button onClick={() => setCurateModalOpen(true)} disabled={curateLoading}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {curateLoading ? "Curating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filters.category === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected articles bar */}
      {selectedArticles.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-indigo-700">
            {selectedArticles.length} article{selectedArticles.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedArticles([])}>
              Clear
            </Button>
            <Button size="sm" onClick={handleGenerateDraft}>
              Generate Draft
            </Button>
          </div>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No articles yet</h3>
          <p className="text-sm text-gray-500 mb-6">Run AI curation on a topic to start discovering content.</p>
          <Button onClick={() => setCurateModalOpen(true)}>Run AI Curation</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <FeedCard
              key={article.id}
              article={article}
              onBookmark={toggleBookmark}
              onAddToDraft={toggleSelectArticle}
            />
          ))}
        </div>
      )}

      {/* Curate topic selection modal */}
      <Modal isOpen={curateModalOpen} onClose={() => setCurateModalOpen(false)} title="Select Topic to Curate">
        {topics.length === 0 ? (
          <p className="text-sm text-gray-500">No topics available. Add a topic first.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-3">Choose a topic to fetch and analyze new articles:</p>
            {topics.filter((t) => t.is_active).map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleCurate(topic.id)}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                <span className="ml-2 text-xs text-gray-400">{topic.keywords.slice(0, 3).join(", ")}</span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
