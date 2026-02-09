import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { draftId, userId, platform } = await request.json();

    if (!draftId || !userId || !platform) {
      return NextResponse.json(
        { error: "draftId, userId, and platform are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Get draft
    const { data: draft } = await supabase
      .from("drafts")
      .select("*")
      .eq("id", draftId)
      .eq("user_id", userId)
      .single();

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // 2. Get platform connection
    const { data: connection } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("platform", platform)
      .eq("is_active", true)
      .single();

    if (!connection) {
      return NextResponse.json(
        { error: `No active ${platform} connection found` },
        { status: 400 }
      );
    }

    // 3. Publish based on platform
    let result;
    let platformPostId: string | null = null;
    let platformUrl: string | null = null;

    try {
      if (platform === "beehiiv") {
        result = await publishToBeehiiv(
          connection.api_key,
          connection.publication_id || "",
          draft.title,
          draft.content
        );
        platformPostId = result?.data?.id || null;
        platformUrl = result?.data?.web_url || null;
      } else {
        return NextResponse.json(
          { error: `${platform} publishing not yet supported` },
          { status: 400 }
        );
      }

      // 4. Record success in publish_history
      await supabase.from("publish_history").insert({
        draft_id: draftId,
        user_id: userId,
        platform,
        platform_post_id: platformPostId,
        platform_url: platformUrl,
        status: "success" as const,
      });

      // 5. Update draft status
      await supabase
        .from("drafts")
        .update({ status: "published" })
        .eq("id", draftId);

      return NextResponse.json({
        message: `Published to ${platform} successfully`,
        result,
      });
    } catch (publishError) {
      // Record failure in publish_history
      await supabase.from("publish_history").insert({
        draft_id: draftId,
        user_id: userId,
        platform,
        status: "failed" as const,
        error_message:
          publishError instanceof Error
            ? publishError.message
            : "Unknown error",
      });

      throw publishError;
    }
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    );
  }
}

async function publishToBeehiiv(
  apiKey: string,
  publicationId: string,
  title: string,
  content: string
) {
  // Convert markdown to HTML (basic conversion)
  const htmlContent = content
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/posts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: htmlContent,
        status: "draft", // Create as draft in Beehiiv for review
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Beehiiv API error: ${error}`);
  }

  return res.json();
}
