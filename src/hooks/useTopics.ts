"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import type { Topic } from "@/lib/database.types";

export type TopicWithCount = Topic & { article_count: number };

export function useTopics() {
  const { supabase, user } = useUser();
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("topics")
      .select("*, articles(count)")
      .order("created_at", { ascending: false });

    const mapped = (data || []).map((t) => ({
      ...t,
      article_count: (t as Record<string, unknown>).articles
        ? ((t as Record<string, unknown>).articles as { count: number }[])[0]?.count ?? 0
        : 0,
    })) as TopicWithCount[];

    setTopics(mapped);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const addTopic = async (data: {
    name: string;
    keywords: string[];
    rss_urls: string[];
    category: string;
    is_active: boolean;
  }) => {
    if (!user) return;
    const { error } = await supabase.from("topics").insert({
      user_id: user.id,
      ...data,
    });
    if (!error) await fetchTopics();
    return error;
  };

  const updateTopic = async (
    id: string,
    data: Partial<{
      name: string;
      keywords: string[];
      rss_urls: string[];
      category: string;
      is_active: boolean;
    }>
  ) => {
    const { error } = await supabase.from("topics").update(data).eq("id", id);
    if (!error) await fetchTopics();
    return error;
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from("topics").delete().eq("id", id);
    if (!error) await fetchTopics();
    return error;
  };

  return { topics, loading, addTopic, updateTopic, deleteTopic, refresh: fetchTopics };
}
