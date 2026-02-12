"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "./useUser";
import type { Draft, Article } from "@/lib/database.types";
import { TIMING } from "@/lib/constants";
import { countWords } from "@/lib/utils";

export function useDraft(draftId: string) {
  const { supabase, user } = useUser();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sourceArticles, setSourceArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || !draftId) return;
    let active = true;

    (async () => {
      try {
        const { data: draftData, error: draftError } = await supabase
          .from("drafts")
          .select("*")
          .eq("id", draftId)
          .eq("user_id", user.id)
          .single();

        if (!active) return;
        if (draftError) throw draftError;
        if (draftData) setDraft(draftData);

        const { data: junctionData } = await supabase
          .from("draft_articles")
          .select("*, articles(*)")
          .eq("draft_id", draftId);

        if (!active) return;
        if (junctionData) {
          const articles = junctionData
            .map((j) => (j as Record<string, unknown>).articles as Article)
            .filter(Boolean);
          setSourceArticles(articles);
        }

        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load draft");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [supabase, user, draftId, refreshKey]);

  const saveDraft = useCallback(
    async (content: string) => {
      if (!draftId || !user) return;
      setSaveStatus("saving");
      const wordCount = countWords(content);
      const { error: saveError } = await supabase
        .from("drafts")
        .update({ content, word_count: wordCount })
        .eq("id", draftId)
        .eq("user_id", user.id);

      if (saveError) {
        setSaveStatus("error");
        console.error("Save failed:", saveError);
        setTimeout(() => setSaveStatus("idle"), TIMING.SAVE_DISPLAY_MS);
        return;
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), TIMING.SAVE_DISPLAY_MS);
    },
    [supabase, draftId, user]
  );

  const debouncedSave = useCallback(
    (content: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(content), TIMING.DEBOUNCE_MS);
    },
    [saveDraft]
  );

  const updateStatus = async (status: Draft["status"]) => {
    if (!user) return;
    await supabase.from("drafts").update({ status }).eq("id", draftId).eq("user_id", user.id);
    setDraft((prev) => (prev ? { ...prev, status } : null));
  };

  const refresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  return {
    draft,
    sourceArticles,
    loading,
    error,
    saveStatus,
    saveDraft,
    debouncedSave,
    updateStatus,
    refresh,
  };
}
