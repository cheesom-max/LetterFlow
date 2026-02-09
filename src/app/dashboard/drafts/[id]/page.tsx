import Editor from "@/components/drafts/Editor";
import { drafts } from "@/data/dummy";

export function generateStaticParams() {
  return drafts.map((draft) => ({
    id: draft.id,
  }));
}

export default function DraftEditorPage() {
  return <Editor />;
}
