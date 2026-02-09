"use client";

import { use } from "react";
import Editor from "@/components/drafts/Editor";

export default function DraftEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Editor draftId={id} />;
}
