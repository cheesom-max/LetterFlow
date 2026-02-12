import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-api";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { checkPlanLimit } from "@/lib/plan-limits";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// Shared Markdown-to-HTML conversion with sanitization
async function markdownToSafeHtml(content: string): Promise<string> {
  const rawHtml = await marked.parse(content);
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "img",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      a: ["href", "target", "rel"],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (per user, standard route)
    const rateCheck = checkRateLimit(user.id, RATE_LIMITS.STANDARD_ROUTE.maxRequests, RATE_LIMITS.STANDARD_ROUTE.windowMs);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rateCheck.retryAfterMs ?? 0) / 1000)) },
        }
      );
    }

    const { draftId, platform } = await request.json();

    if (!draftId || !platform) {
      return NextResponse.json(
        { error: "draftId and platform are required" },
        { status: 400 }
      );
    }

    // Check plan limit
    const planCheck = await checkPlanLimit(supabase, user.id, "platforms");
    if (!planCheck.allowed) {
      return NextResponse.json(
        {
          error: "Publishing requires a Starter plan or higher. Upgrade your plan to publish.",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    // 1. Get draft (RLS ensures user can only access own drafts)
    const { data: draft } = await supabase
      .from("drafts")
      .select("*")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .single();

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // 2. Get platform connection
    const { data: connection } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", user.id)
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
    let platformPostId: string | null = null;
    let platformUrl: string | null = null;

    try {
      if (platform === "beehiiv") {
        const result = await publishToBeehiiv(
          connection.api_key,
          connection.publication_id || "",
          draft.title,
          draft.content
        );
        platformPostId = result?.data?.id || null;
        platformUrl = result?.data?.web_url || null;
      } else if (platform === "kit") {
        const result = await publishToKit(
          connection.api_key,
          draft.title,
          draft.content
        );
        platformPostId = result?.broadcast?.id?.toString() || null;
        platformUrl = null;
      } else {
        return NextResponse.json(
          { error: `${platform} publishing is not yet supported.` },
          { status: 400 }
        );
      }

      // 4. Record success in publish_history
      await supabase.from("publish_history").insert({
        draft_id: draftId,
        user_id: user.id,
        platform,
        platform_post_id: platformPostId,
        platform_url: platformUrl,
        status: "success" as const,
      });

      // 5. Update draft status
      await supabase
        .from("drafts")
        .update({ status: "published" })
        .eq("id", draftId)
        .eq("user_id", user.id);

      return NextResponse.json({
        message: `Published to ${platform} successfully`,
        platformUrl,
      });
    } catch (publishError) {
      // Record failure in publish_history
      await supabase.from("publish_history").insert({
        draft_id: draftId,
        user_id: user.id,
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
  const htmlContent = await markdownToSafeHtml(content);

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
    const errorText = await res.text();
    console.error("Beehiiv API error:", errorText);
    throw new Error("Failed to publish to Beehiiv");
  }

  return res.json();
}

async function publishToKit(
  apiKey: string,
  title: string,
  content: string
) {
  const htmlContent = await markdownToSafeHtml(content);

  const res = await fetch("https://api.kit.com/v4/broadcasts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: htmlContent,
      subject: title,
      description: title,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Kit API error:", errorText);
    throw new Error("Failed to publish to Kit");
  }

  return res.json();
}
