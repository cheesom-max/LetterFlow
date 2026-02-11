import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-api";
import { rewriteInStyle, makeShorter, generateTldr } from "@/lib/openai";
import { AI_ACTIONS, DEFAULT_STYLE_PROFILE, ERROR_MESSAGES } from "@/lib/constants";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, content } = await request.json();
    if (!action || !content) {
      return NextResponse.json({ error: "action and content are required" }, { status: 400 });
    }

    if (!AI_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Rewrite requires style learning (starter+ plan)
    if (action === "rewrite") {
      const planCheck = await checkPlanLimit(supabase, user.id, "styleLearning");
      if (!planCheck.allowed) {
        return NextResponse.json(
          {
            error: "Style rewriting requires a Starter plan or higher. Upgrade to unlock this feature.",
            upgrade: true,
          },
          { status: 403 }
        );
      }
    }

    let result: string;

    if (action === "rewrite") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("style_profile")
        .eq("id", user.id)
        .single();

      const styleProfile = profile?.style_profile || DEFAULT_STYLE_PROFILE;
      result = await rewriteInStyle(content, styleProfile);
    } else if (action === "shorten") {
      result = await makeShorter(content);
    } else {
      result = await generateTldr(content);
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI transform error:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.AI_FAILED },
      { status: 500 }
    );
  }
}
