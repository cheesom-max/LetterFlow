"use client";

import { useState, useEffect } from "react";
import { useUser } from "./useUser";
import type { Draft } from "@/lib/database.types";

export function useDrafts() {
  const { supabase, user } = useUser();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
        let query = supabase
          .from("drafts")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (statusFilter !== "All") {
          const dbStatus = statusFilter.toLowerCase().replace(" ", "") as Draft["status"];
          query = query.eq("status", dbStatus);
        }

        const { data, error: queryError } = await query;
        if (!active) return;
        if (queryError) throw queryError;
        setDrafts(data || []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load drafts");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [supabase, user, statusFilter, refreshKey]);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  return { drafts, loading, error, statusFilter, setStatusFilter, refresh };
}
