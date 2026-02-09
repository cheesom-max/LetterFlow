"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { draftContent, feedArticles } from "@/data/dummy";

export default function Editor() {
  const [content, setContent] = useState(draftContent);
  const sources = feedArticles.slice(0, 4);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Editor panel */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Badge variant="default">Draft</Badge>
            <span className="text-sm text-gray-400">
              {content.split(/\s+/).length} words
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Button>
            <Button size="sm">
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
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Rewrite in my style
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              Make it shorter
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate subject lines
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Add TL;DR summary
            </button>
          </div>
        </div>

        {/* Source articles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Source Articles</h3>
          <div className="space-y-3">
            {sources.map((article) => (
              <div
                key={article.id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors"
              >
                <p className="text-xs font-medium text-gray-900 leading-snug line-clamp-2">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <span className="text-xs text-indigo-500 font-medium">
                    {article.relevanceScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
