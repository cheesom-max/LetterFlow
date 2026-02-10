import OpenAI from "openai";
import { OPENAI_MODELS, OPENAI_PARAMS } from "./constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeArticle(
  title: string,
  content: string
): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O_MINI,
      messages: [
        {
          role: "system",
          content:
            "You are a content curator for newsletters. Summarize the given article in 2-3 concise sentences, highlighting the key insight that would be most relevant for a newsletter audience.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}`,
        },
      ],
      max_tokens: OPENAI_PARAMS.SUMMARIZE.maxTokens,
      temperature: OPENAI_PARAMS.SUMMARIZE.temperature,
    });
    return res.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("summarizeArticle error:", error);
    throw new Error("Failed to summarize article");
  }
}

export async function scoreRelevance(
  articleTitle: string,
  articleSummary: string,
  topicKeywords: string[]
): Promise<number> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O_MINI,
      messages: [
        {
          role: "system",
          content:
            "Rate how relevant the given article is to the user's topic keywords on a scale of 0-100. Return ONLY the number, nothing else.",
        },
        {
          role: "user",
          content: `Topic keywords: ${topicKeywords.join(", ")}\n\nArticle: ${articleTitle}\n${articleSummary}`,
        },
      ],
      max_tokens: OPENAI_PARAMS.SCORE_RELEVANCE.maxTokens,
      temperature: OPENAI_PARAMS.SCORE_RELEVANCE.temperature,
    });
    const score = parseInt(res.choices[0]?.message?.content || "50", 10);
    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error("scoreRelevance error:", error);
    throw new Error("Failed to score relevance");
  }
}

export async function generateDraft(
  articles: { title: string; summary: string }[],
  styleProfile: string | null,
  newsletterName: string | null
): Promise<{ title: string; content: string }> {
  try {
    const articleContext = articles
      .map((a, i) => `${i + 1}. ${a.title}: ${a.summary}`)
      .join("\n");

    const styleInstruction = styleProfile
      ? `Write in this style: ${styleProfile}`
      : "Write in a conversational, engaging tone with short paragraphs and bold key takeaways.";

    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O,
      messages: [
        {
          role: "system",
          content: `You are a newsletter writer for "${newsletterName || "a weekly newsletter"}". ${styleInstruction}

Structure:
- Catchy headline
- Brief intro (1-2 sentences)
- 2-4 sections based on the curated articles
- Each section: subheading, 2-3 paragraphs with key insight and your take
- Brief closing with CTA

Use markdown formatting. Be concise but insightful.`,
        },
        {
          role: "user",
          content: `Write a newsletter based on these curated articles:\n\n${articleContext}`,
        },
      ],
      max_tokens: OPENAI_PARAMS.GENERATE_DRAFT.maxTokens,
      temperature: OPENAI_PARAMS.GENERATE_DRAFT.temperature,
    });

    const content = res.choices[0]?.message?.content || "";
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : "Weekly Newsletter Draft";

    return { title, content };
  } catch (error) {
    console.error("generateDraft error:", error);
    throw new Error("Failed to generate draft");
  }
}

export async function generateSubjectLines(
  draftTitle: string,
  draftContent: string
): Promise<string[]> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O_MINI,
      messages: [
        {
          role: "system",
          content:
            "Generate 5 email subject lines for this newsletter. Make them engaging, curiosity-driven, and under 60 characters. Return them as a numbered list.",
        },
        {
          role: "user",
          content: `Title: ${draftTitle}\n\nContent preview: ${draftContent.slice(0, 500)}`,
        },
      ],
      max_tokens: OPENAI_PARAMS.SUBJECT_LINES.maxTokens,
      temperature: OPENAI_PARAMS.SUBJECT_LINES.temperature,
    });

    const lines = (res.choices[0]?.message?.content || "")
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => l.replace(/^\d+\.\s*/, "").trim());
    return lines;
  } catch (error) {
    console.error("generateSubjectLines error:", error);
    throw new Error("Failed to generate subject lines");
  }
}

export async function rewriteInStyle(
  content: string,
  styleProfile: string
): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O,
      messages: [
        {
          role: "system",
          content: `You are a newsletter editor. Rewrite the following newsletter content to match this writing style: ${styleProfile}

Keep the same structure, information, and key points. Only change the tone, vocabulary, and sentence style. Output the rewritten content in markdown.`,
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: OPENAI_PARAMS.REWRITE.maxTokens,
      temperature: OPENAI_PARAMS.REWRITE.temperature,
    });
    return res.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("rewriteInStyle error:", error);
    throw new Error("Failed to rewrite content");
  }
}

export async function makeShorter(content: string): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O,
      messages: [
        {
          role: "system",
          content:
            "You are a newsletter editor. Condense the following newsletter content to roughly half its length. Keep the most important insights and key takeaways. Maintain the same structure (headings, sections) but make each section shorter. Output in markdown.",
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: OPENAI_PARAMS.SHORTEN.maxTokens,
      temperature: OPENAI_PARAMS.SHORTEN.temperature,
    });
    return res.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("makeShorter error:", error);
    throw new Error("Failed to shorten content");
  }
}

export async function generateTldr(content: string): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT_4O_MINI,
      messages: [
        {
          role: "system",
          content:
            "Write a concise TL;DR summary (2-3 bullet points) for this newsletter. Format as markdown with a **TL;DR** heading and bullet points. Keep it under 100 words.",
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: OPENAI_PARAMS.TLDR.maxTokens,
      temperature: OPENAI_PARAMS.TLDR.temperature,
    });
    return res.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("generateTldr error:", error);
    throw new Error("Failed to generate TL;DR");
  }
}

export default openai;
