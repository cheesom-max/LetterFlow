import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeArticle(
  title: string,
  content: string
): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    max_tokens: 200,
    temperature: 0.3,
  });
  return res.choices[0]?.message?.content || "";
}

export async function scoreRelevance(
  articleTitle: string,
  articleSummary: string,
  topicKeywords: string[]
): Promise<number> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    max_tokens: 10,
    temperature: 0,
  });
  const score = parseInt(res.choices[0]?.message?.content || "50", 10);
  return Math.min(100, Math.max(0, score));
}

export async function generateDraft(
  articles: { title: string; summary: string }[],
  styleProfile: string | null,
  newsletterName: string | null
): Promise<{ title: string; content: string }> {
  const articleContext = articles
    .map((a, i) => `${i + 1}. ${a.title}: ${a.summary}`)
    .join("\n");

  const styleInstruction = styleProfile
    ? `Write in this style: ${styleProfile}`
    : "Write in a conversational, engaging tone with short paragraphs and bold key takeaways.";

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
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
    max_tokens: 2000,
    temperature: 0.7,
  });

  const content = res.choices[0]?.message?.content || "";
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1] : "Weekly Newsletter Draft";

  return { title, content };
}

export async function generateSubjectLines(
  draftTitle: string,
  draftContent: string
): Promise<string[]> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    max_tokens: 300,
    temperature: 0.8,
  });

  const lines = (res.choices[0]?.message?.content || "")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.replace(/^\d+\.\s*/, "").trim());
  return lines;
}

export default openai;
