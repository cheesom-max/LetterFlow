"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import type { Topic } from "@/lib/database.types";
import { PLAN_LIMITS, type Plan } from "@/lib/plan-limits";

export type TopicWithCount = Topic & { article_count: number };

export function useTopics() {
  const { supabase, user } = useUser();
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userPlan, setUserPlan] = useState<Plan>("free");

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
        // Fetch user plan
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();
        if (profile?.plan) setUserPlan(profile.plan as Plan);

        const { data, error: queryError } = await supabase
          .from("topics")
          .select("*, articles(count)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!active) return;
        if (queryError) throw queryError;

        const mapped = (data || []).map((t) => ({
          ...t,
          article_count: (t as Record<string, unknown>).articles
            ? ((t as Record<string, unknown>).articles as { count: number }[])[0]?.count ?? 0
            : 0,
        })) as TopicWithCount[];

        setTopics(mapped);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load topics");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [supabase, user, refreshKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  const addTopic = async (data: {
    name: string;
    keywords: string[];
    rss_urls: string[];
    category: string;
    is_active: boolean;
  }) => {
    if (!user) return;

    // Check topic limit
    const topicLimit = PLAN_LIMITS[userPlan].topics as number;
    if (topicLimit !== -1 && topics.length >= topicLimit) {
      return { message: `Topic limit reached (${topics.length}/${topicLimit}). Upgrade your plan to add more topics.` };
    }

    const { error } = await supabase.from("topics").insert({
      user_id: user.id,
      ...data,
    });
    if (!error) refresh();
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
    if (!user) return;
    const { error } = await supabase.from("topics").update(data).eq("id", id).eq("user_id", user.id);
    if (!error) refresh();
    return error;
  };

  const deleteTopic = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("topics").delete().eq("id", id).eq("user_id", user.id);
    if (!error) refresh();
    return error;
  };

  return { topics, loading, error, addTopic, updateTopic, deleteTopic, refresh };
}
