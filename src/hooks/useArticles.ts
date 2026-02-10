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
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
        let query = supabase
          .from("articles")
          .select("*, topics(name, category)")
          .eq("user_id", user.id)
          .order("relevance_score", { ascending: false });

        if (filters.search) {
          query = query.ilike("title", `%${filters.search}%`);
        }

        const { data, error: queryError } = await query;
        if (!active) return;
        if (queryError) throw queryError;

        let mapped = (data || []).map((a) => {
          const topic = (a as Record<string, unknown>).topics as { name: string; category: string } | null;
          return {
            ...a,
            topic_name: topic?.name ?? "",
            _category: topic?.category ?? "",
          };
        });

        const uniqueCats = [...new Set(mapped.map((a) => a._category).filter(Boolean))];
        setCategories(uniqueCats);

        if (filters.category !== "All") {
          mapped = mapped.filter((a) => a._category === filters.category);
        }

        setArticles(mapped as unknown as ArticleWithTopic[]);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load articles");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [supabase, user, filters, refreshKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  const toggleBookmark = async (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article || !user) return;

    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_bookmarked: !a.is_bookmarked } : a))
    );

    const { error } = await supabase
      .from("articles")
      .update({ is_bookmarked: !article.is_bookmarked })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_bookmarked: article.is_bookmarked } : a))
      );
    }
  };

  const curate = async (topicId: string) => {
    if (!user) return;
    setCurateLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to curate articles");
        return;
      }
      refresh();
    } finally {
      setCurateLoading(false);
    }
  };

  return {
    articles,
    categories,
    loading,
    error,
    filters,
    setFilters,
    toggleBookmark,
    curate,
    curateLoading,
    refresh,
  };
}
