import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-api";
import { generateSubjectLines } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await getAuthenticatedUser(request);
    if (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    const subjectLines = await generateSubjectLines(title, content);

    return NextResponse.json({ subjectLines });
  } catch (error) {
    console.error("Subject line generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate subject lines" },
      { status: 500 }
    );
  }
}
