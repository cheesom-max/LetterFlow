"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useDraft } from "@/hooks/useDraft";
import { useUser } from "@/hooks/useUser";
import { DRAFT_STATUS_MAP } from "@/lib/constants";
import { countWords } from "@/lib/utils";

interface EditorProps {
  draftId: string;
}

export default function Editor({ draftId }: EditorProps) {
  const { draft, sourceArticles, loading, saveStatus, debouncedSave, updateStatus } = useDraft(draftId);
  const { user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync content from loaded draft
  useEffect(() => {
    if (draft?.content) setContent(draft.content);
  }, [draft?.content]);

  // Auto-save on content change
  useEffect(() => {
    if (draft && content !== draft.content) {
      debouncedSave(content);
    }
  }, [content, draft, debouncedSave]);

  const handleGenerateSubjectLines = async () => {
    if (!draft) return;
    setSubjectLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subject-lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draft.title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to generate subject lines");
        return;
      }
      const data = await res.json();
      setSubjectLines(data.subjectLines || []);
      setSubjectModalOpen(true);
    } finally {
      setSubjectLoading(false);
    }
  };

  const handleAiTransform = async (action: "rewrite" | "shorten" | "tldr") => {
    if (!content.trim()) return;
    setAiLoading(action);
    setError(null);
    try {
      const res = await fetch("/api/ai-transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "AI transformation failed");
        return;
      }
      const data = await res.json();
      if (action === "tldr") {
        setContent(data.result + "\n\n---\n\n" + content);
      } else {
        setContent(data.result);
      }
    } finally {
      setAiLoading(null);
    }
  };

  const handlePublish = async (platform: "beehiiv" | "substack" | "kit") => {
    if (!user || !draft) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id, platform }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to publish");
        return;
      }
      await updateStatus("published");
      setPublishModalOpen(false);
      router.push("/dashboard/drafts");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
        <div className="w-full lg:w-80 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Draft not found</h3>
        <p className="text-sm text-gray-500 mb-6">This draft may have been deleted.</p>
        <Button onClick={() => router.push("/dashboard/drafts")}>Back to Drafts</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Editor panel */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Badge variant={DRAFT_STATUS_MAP[draft.status]?.variant || "default"}>
              {DRAFT_STATUS_MAP[draft.status]?.label || draft.status}
            </Badge>
            <span className="text-sm text-gray-400">
              {countWords(content)} words
            </span>
            {saveStatus === "saving" && (
              <span className="text-xs text-amber-500">Saving...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-green-500">Saved</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/drafts")}>
              Back
            </Button>
            <Button size="sm" onClick={() => setPublishModalOpen(true)}>
              Publish
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-6 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none font-mono"
          placeholder="Start writing your newsletter..."
        />
      </div>

      {/* AI Assist sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        {/* AI Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Assist</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleAiTransform("rewrite")}
              disabled={aiLoading !== null}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {aiLoading === "rewrite" ? "Rewriting..." : "Rewrite in my style"}
            </button>
            <button
              onClick={() => handleAiTransform("shorten")}
              disabled={aiLoading !== null}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              {aiLoading === "shorten" ? "Shortening..." : "Make it shorter"}
            </button>
            <button
              onClick={handleGenerateSubjectLines}
              disabled={subjectLoading}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {subjectLoading ? "Generating..." : "Generate subject lines"}
            </button>
            <button
              onClick={() => handleAiTransform("tldr")}
              disabled={aiLoading !== null}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {aiLoading === "tldr" ? "Generating..." : "Add TL;DR summary"}
            </button>
          </div>
        </div>

        {/* Source articles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Source Articles ({sourceArticles.length})
          </h3>
          {sourceArticles.length === 0 ? (
            <p className="text-xs text-gray-400">No source articles linked to this draft.</p>
          ) : (
            <div className="space-y-3">
              {sourceArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <p className="text-xs font-medium text-gray-900 leading-snug line-clamp-2">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-400">{article.source}</span>
                    <span className="text-xs text-indigo-500 font-medium">
                      {article.relevance_score}%
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <span className="text-sm flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Subject Lines Modal */}
      <Modal isOpen={subjectModalOpen} onClose={() => setSubjectModalOpen(false)} title="Subject Line Suggestions">
        <div className="space-y-2">
          {subjectLines.map((line, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer text-sm text-gray-900"
              onClick={() => {
                navigator.clipboard.writeText(line);
                setSubjectModalOpen(false);
              }}
            >
              {line}
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-2">Click to copy to clipboard</p>
        </div>
      </Modal>

      {/* Publish Modal */}
      <Modal isOpen={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="Publish Newsletter">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-3">Choose a platform to publish:</p>
          {(["beehiiv", "substack", "kit"] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => handlePublish(platform)}
              disabled={publishing}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="text-sm font-medium text-gray-900 capitalize">{platform}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
