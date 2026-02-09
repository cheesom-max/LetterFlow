import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { fetchMultipleFeeds } from "@/lib/rss";
import { summarizeArticle, scoreRelevance } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { topicId, userId } = await request.json();

    if (!topicId || !userId) {
      return NextResponse.json(
        { error: "topicId and userId are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Get topic details
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("*")
      .eq("id", topicId)
      .single();

    if (topicError || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // 2. Fetch RSS feeds
    const rssItems = await fetchMultipleFeeds(topic.rss_urls);

    if (rssItems.length === 0) {
      return NextResponse.json({
        message: "No articles found from RSS feeds",
        articles: [],
      });
    }

    // 3. Summarize and score each article with AI
    const articles = [];

    for (const item of rssItems.slice(0, 10)) {
      const summary = await summarizeArticle(item.title, item.description);
      const relevanceScore = await scoreRelevance(
        item.title,
        summary,
        topic.keywords
      );

      // 4. Save to database
      const { data: article } = await supabase
        .from("articles")
        .insert({
          user_id: userId,
          topic_id: topicId,
          title: item.title,
          summary,
          source: item.source,
          source_url: item.link,
          relevance_score: relevanceScore,
          is_bookmarked: false,
          published_at: item.pubDate || new Date().toISOString(),
        })
        .select()
        .single();

      if (article) {
        articles.push(article);
      }
    }

    // Sort by relevance
    articles.sort((a, b) => b.relevance_score - a.relevance_score);

    return NextResponse.json({
      message: `Curated ${articles.length} articles for "${topic.name}"`,
      articles,
    });
  } catch (error) {
    console.error("Curation error:", error);
    return NextResponse.json(
      { error: "Failed to curate articles" },
      { status: 500 }
    );
  }
}
