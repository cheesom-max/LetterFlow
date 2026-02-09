"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import type { Draft } from "@/lib/database.types";

export function useDrafts() {
  const { supabase, user } = useUser();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchDrafts = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("drafts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (statusFilter !== "All") {
      const dbStatus = statusFilter.toLowerCase().replace(" ", "") as Draft["status"];
      query = query.eq("status", dbStatus);
    }

    const { data } = await query;
    setDrafts(data || []);
    setLoading(false);
  }, [supabase, user, statusFilter]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  return { drafts, loading, statusFilter, setStatusFilter, refresh: fetchDrafts };
}
