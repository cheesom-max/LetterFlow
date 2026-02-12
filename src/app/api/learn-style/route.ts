import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-api";
import { analyzeWritingStyle } from "@/lib/openai";
import { checkPlanLimit } from "@/lib/plan-limits";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import sanitizeHtml from "sanitize-html";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB per file
const MAX_FILES = 10;
const MAX_TOTAL_CHARS = 10000;
const ALLOWED_EXTENSIONS = [".txt", ".md", ".html"];

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

    // Check plan limit
    const planCheck = await checkPlanLimit(supabase, user.id, "styleLearning");
    if (!planCheck.allowed) {
      return NextResponse.json(
        {
          error: "Style learning requires a Starter plan or higher. Upgrade your plan to use this feature.",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "At least one file is required" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    // Extract text from files
    const textParts: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 1MB limit` },
          { status: 400 }
        );
      }

      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
          { status: 400 }
        );
      }

      const content = await file.text();

      if (ext === ".html") {
        // Strip HTML tags to get plain text
        const plainText = sanitizeHtml(content, {
          allowedTags: [],
          allowedAttributes: {},
        });
        textParts.push(plainText.trim());
      } else {
        // .txt and .md - use as-is
        textParts.push(content.trim());
      }
    }

    // Combine and truncate
    const combinedText = textParts.join("\n\n---\n\n").slice(0, MAX_TOTAL_CHARS);

    if (combinedText.length < 100) {
      return NextResponse.json(
        { error: "Not enough content to analyze. Please upload files with more text." },
        { status: 400 }
      );
    }

    // Analyze style with AI
    const styleProfile = await analyzeWritingStyle(combinedText);

    // Save to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ style_profile: styleProfile })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save style profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Style profile analyzed successfully",
      styleProfile,
    });
  } catch (error) {
    console.error("Style learning error:", error);
    return NextResponse.json(
      { error: "Failed to analyze writing style" },
      { status: 500 }
    );
  }
}
