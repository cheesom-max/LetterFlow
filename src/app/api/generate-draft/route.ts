import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateDraft } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { userId, articleIds } = await request.json();

    if (!userId || !articleIds?.length) {
      return NextResponse.json(
        { error: "userId and articleIds are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Get user profile (for style and newsletter name)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // 2. Get selected articles
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .in("id", articleIds)
      .order("relevance_score", { ascending: false });

    if (articlesError || !articles?.length) {
      return NextResponse.json(
        { error: "No articles found" },
        { status: 404 }
      );
    }

    // 3. Generate newsletter draft with AI
    const { title, content } = await generateDraft(
      articles.map((a) => ({ title: a.title, summary: a.summary || "" })),
      profile?.style_profile || null,
      profile?.newsletter_name || null
    );

    const wordCount = content.split(/\s+/).length;

    // 4. Save draft to database
    const { data: draft, error: draftError } = await supabase
      .from("drafts")
      .insert({
        user_id: userId,
        title,
        content,
        status: "draft" as const,
        word_count: wordCount,
        sources_used: articles.length,
      })
      .select()
      .single();

    if (draftError || !draft) {
      return NextResponse.json(
        { error: "Failed to save draft" },
        { status: 500 }
      );
    }

    // 5. Save draft ↔ article relationships (M:N 중간 테이블)
    const draftArticleRows = articleIds.map((articleId: string) => ({
      draft_id: draft.id,
      article_id: articleId,
    }));

    await supabase.from("draft_articles").insert(draftArticleRows);

    return NextResponse.json({
      message: "Draft generated successfully",
      draft,
    });
  } catch (error) {
    console.error("Draft generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate draft" },
      { status: 500 }
    );
  }
}
