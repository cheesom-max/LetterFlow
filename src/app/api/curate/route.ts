import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-api";
import { fetchMultipleFeeds } from "@/lib/rss";
import { summarizeArticle, scoreRelevance } from "@/lib/openai";
import { checkPlanLimit } from "@/lib/plan-limits";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (per user, AI-heavy route)
    const rateCheck = checkRateLimit(user.id, RATE_LIMITS.AI_ROUTE.maxRequests, RATE_LIMITS.AI_ROUTE.windowMs);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rateCheck.retryAfterMs ?? 0) / 1000)) },
        }
      );
    }

    const { topicId } = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: "topicId is required" },
        { status: 400 }
      );
    }

    // Check plan limit
    const planCheck = await checkPlanLimit(supabase, user.id, "curations");
    if (!planCheck.allowed) {
      return NextResponse.json(
        {
          error: `Plan limit reached (${planCheck.used}/${planCheck.limit} curations this month). Upgrade your plan to continue.`,
          upgrade: true,
        },
        { status: 403 }
      );
    }

    // 1. Get topic details (RLS ensures user can only access own topics)
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("*")
      .eq("id", topicId)
      .eq("user_id", user.id)
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

    // 3. Summarize and score each article with AI (parallel processing)
    const articlePromises = rssItems.slice(0, 10).map(async (item) => {
      const summary = await summarizeArticle(item.title, item.description);
      const relevanceScore = await scoreRelevance(item.title, summary, topic.keywords);
      return { item, summary, relevanceScore };
    });

    const settledResults = await Promise.allSettled(articlePromises);

    // 4. Save successful results to database
    const articles = [];

    for (const result of settledResults) {
      if (result.status !== "fulfilled") continue;
      const { item, summary, relevanceScore } = result.value;

      const { data: article } = await supabase
        .from("articles")
        .insert({
          user_id: user.id,
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
