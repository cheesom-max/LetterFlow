"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import type { Article } from "@/lib/database.types";

export type ArticleWithTopic = Article & { topic_name: string };

interface Filters {
  category: string;
  search: string;
}

export function useArticles() {
  const { supabase, user } = useUser();
  const [articles, setArticles] = useState<ArticleWithTopic[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ category: "All", search: "" });
  const [curateLoading, setCurateLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("articles")
      .select("*, topics(name, category)")
      .order("relevance_score", { ascending: false });

    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    const { data } = await query;

    let mapped = (data || []).map((a) => {
      const topic = (a as Record<string, unknown>).topics as { name: string; category: string } | null;
      return {
        ...a,
        topic_name: topic?.name ?? "",
        _category: topic?.category ?? "",
      };
    });

    // Extract unique categories
    const uniqueCats = [...new Set(mapped.map((a) => a._category).filter(Boolean))];
    setCategories(uniqueCats);

    // Client-side category filter (via topic's category)
    if (filters.category !== "All") {
      mapped = mapped.filter((a) => a._category === filters.category);
    }

    setArticles(mapped as unknown as ArticleWithTopic[]);
    setLoading(false);
  }, [supabase, user, filters]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const toggleBookmark = async (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    // Optimistic update
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_bookmarked: !a.is_bookmarked } : a))
    );

    const { error } = await supabase
      .from("articles")
      .update({ is_bookmarked: !article.is_bookmarked })
      .eq("id", id);

    if (error) {
      // Revert on error
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_bookmarked: article.is_bookmarked } : a))
      );
    }
  };

  const curate = async (topicId: string) => {
    if (!user) return;
    setCurateLoading(true);
    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, userId: user.id }),
      });
      if (res.ok) {
        await fetchArticles();
      }
    } finally {
      setCurateLoading(false);
    }
  };

  return {
    articles,
    categories,
    loading,
    filters,
    setFilters,
    toggleBookmark,
    curate,
    curateLoading,
    refresh: fetchArticles,
  };
}
