"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "./useUser";
import type { Draft, Article } from "@/lib/database.types";

export function useDraft(draftId: string) {
  const { supabase, user } = useUser();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sourceArticles, setSourceArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchDraft = useCallback(async () => {
    if (!user || !draftId) return;
    setLoading(true);

    const { data: draftData } = await supabase
      .from("drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (draftData) setDraft(draftData);

    // Fetch source articles via junction table
    const { data: junctionData } = await supabase
      .from("draft_articles")
      .select("*, articles(*)")
      .eq("draft_id", draftId);

    if (junctionData) {
      const articles = junctionData
        .map((j) => (j as Record<string, unknown>).articles as Article)
        .filter(Boolean);
      setSourceArticles(articles);
    }

    setLoading(false);
  }, [supabase, user, draftId]);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  const saveDraft = useCallback(
    async (content: string) => {
      if (!draftId) return;
      setSaveStatus("saving");
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      await supabase
        .from("drafts")
        .update({ content, word_count: wordCount })
        .eq("id", draftId);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [supabase, draftId]
  );

  const debouncedSave = useCallback(
    (content: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(content), 2000);
    },
    [saveDraft]
  );

  const updateStatus = async (status: Draft["status"]) => {
    await supabase.from("drafts").update({ status }).eq("id", draftId);
    setDraft((prev) => (prev ? { ...prev, status } : null));
  };

  return {
    draft,
    sourceArticles,
    loading,
    saveStatus,
    saveDraft,
    debouncedSave,
    updateStatus,
    refresh: fetchDraft,
  };
}
