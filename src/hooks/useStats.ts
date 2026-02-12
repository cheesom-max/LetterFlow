"use client";

import { useState, useEffect } from "react";
import { useUser } from "./useUser";

export interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
}

export interface Activity {
  type: "curated" | "draft" | "published" | "topic";
  message: string;
  time: string;
}

function formatRelative(dateStr: string) {
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

export function useStats() {
  const { supabase, user } = useUser();
  const [stats, setStats] = useState<Stat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
      const [topicsRes, articlesRes, draftsRes, publishedRes] = await Promise.all([
        supabase.from("topics").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("drafts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("drafts").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "published"),
      ]);

      if (!active) return;

      const draftCount = draftsRes.count ?? 0;
      const publishedCount = publishedRes.count ?? 0;
      const inProgress = draftCount - publishedCount;

      setStats([
        {
          label: "Monitored Topics",
          value: String(topicsRes.count ?? 0),
          change: "active monitoring",
          changeType: "neutral",
        },
        {
          label: "Curated Articles",
          value: String(articlesRes.count ?? 0),
          change: "total curated",
          changeType: "up",
        },
        {
          label: "Drafts Generated",
          value: String(draftCount),
          change: `${inProgress} in progress`,
          changeType: "neutral",
        },
        {
          label: "Published",
          value: String(publishedCount),
          change: "total published",
          changeType: "up",
        },
      ]);

      // Fetch recent activity queries in parallel
      const [
        { data: recentTopics },
        { data: recentArticles },
        { data: recentDrafts },
      ] = await Promise.all([
        supabase
          .from("topics")
          .select("name, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("articles")
          .select("title, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("drafts")
          .select("title, status, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(3),
      ]);

      if (!active) return;

      const activityItems: Activity[] = [];

      (recentTopics || []).forEach((t) => {
        activityItems.push({
          type: "topic",
          message: `Topic added: ${t.name}`,
          time: formatRelative(t.created_at),
        });
      });

      (recentArticles || []).forEach((a) => {
        activityItems.push({
          type: "curated",
          message: `Article curated: ${a.title}`,
          time: formatRelative(a.created_at),
        });
      });

      (recentDrafts || []).forEach((d) => {
        activityItems.push({
          type: d.status === "published" ? "published" : "draft",
          message: `${d.status === "published" ? "Published" : "Draft"}: ${d.title}`,
          time: formatRelative(d.updated_at),
        });
      });

      setActivities(activityItems.slice(0, 8));
      setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [supabase, user]);

  return { stats, activities, loading, error };
}
