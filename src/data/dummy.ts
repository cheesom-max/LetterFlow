export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  rssUrls: string[];
  category: string;
  articleCount: number;
  isActive: boolean;
}

export interface FeedArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  relevanceScore: number;
  publishedAt: string;
  category: string;
  isBookmarked: boolean;
}

export interface Draft {
  id: string;
  title: string;
  preview: string;
  status: "draft" | "review" | "scheduled" | "published";
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  sourcesUsed: number;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
}

export const stats: Stat[] = [
  { label: "Monitored Topics", value: "8", change: "+2 this week", changeType: "up" },
  { label: "Curated Articles", value: "142", change: "+38 today", changeType: "up" },
  { label: "Drafts Generated", value: "12", change: "3 pending", changeType: "neutral" },
  { label: "Published", value: "47", change: "+4 this month", changeType: "up" },
];

export const topics: Topic[] = [
  {
    id: "1",
    name: "AI & Machine Learning",
    keywords: ["artificial intelligence", "LLM", "GPT", "machine learning", "deep learning"],
    rssUrls: ["https://techcrunch.com/feed/", "https://news.ycombinator.com/rss"],
    category: "Technology",
    articleCount: 45,
    isActive: true,
  },
  {
    id: "2",
    name: "SaaS Growth",
    keywords: ["SaaS metrics", "MRR", "churn rate", "product-led growth", "B2B SaaS"],
    rssUrls: ["https://saastr.com/feed/"],
    category: "Business",
    articleCount: 28,
    isActive: true,
  },
  {
    id: "3",
    name: "Creator Economy",
    keywords: ["newsletter", "creator tools", "monetization", "audience building"],
    rssUrls: [],
    category: "Creator",
    articleCount: 33,
    isActive: true,
  },
  {
    id: "4",
    name: "Web Development",
    keywords: ["React", "Next.js", "TypeScript", "frontend", "web performance"],
    rssUrls: ["https://dev.to/feed/"],
    category: "Technology",
    articleCount: 21,
    isActive: false,
  },
  {
    id: "5",
    name: "Startup Funding",
    keywords: ["venture capital", "seed round", "Series A", "startup valuation"],
    rssUrls: [],
    category: "Business",
    articleCount: 15,
    isActive: true,
  },
];

export const feedArticles: FeedArticle[] = [
  {
    id: "1",
    title: "OpenAI Launches GPT-5 with Breakthrough Reasoning Capabilities",
    summary:
      "OpenAI announced GPT-5 with significant improvements in multi-step reasoning, code generation, and multimodal understanding. The model achieves state-of-the-art results across major benchmarks.",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com",
    relevanceScore: 96,
    publishedAt: "2 hours ago",
    category: "AI & Machine Learning",
    isBookmarked: true,
  },
  {
    id: "2",
    title: "How Beehiiv Grew to 1M+ Newsletter Creators in 2026",
    summary:
      "An inside look at Beehiiv's growth strategy, including their AI-powered tools, referral program, and community-driven approach that helped them surpass 1 million active newsletter creators.",
    source: "The Information",
    sourceUrl: "https://theinformation.com",
    relevanceScore: 92,
    publishedAt: "5 hours ago",
    category: "Creator Economy",
    isBookmarked: false,
  },
  {
    id: "3",
    title: "The State of SaaS Metrics in 2026: What's Changed",
    summary:
      "New benchmarks show that AI-native SaaS companies achieve 29.7x revenue multiples vs 8.2x for traditional SaaS. Net revenue retention above 130% is the new standard for top-quartile performers.",
    source: "SaaStr",
    sourceUrl: "https://saastr.com",
    relevanceScore: 88,
    publishedAt: "8 hours ago",
    category: "SaaS Growth",
    isBookmarked: false,
  },
  {
    id: "4",
    title: "Next.js 15.2 Introduces Server Actions Streaming",
    summary:
      "Vercel released Next.js 15.2 with server actions streaming support, improved partial prerendering, and a new dev tools overlay for debugging hydration issues.",
    source: "Vercel Blog",
    sourceUrl: "https://vercel.com/blog",
    relevanceScore: 85,
    publishedAt: "12 hours ago",
    category: "Web Development",
    isBookmarked: true,
  },
  {
    id: "5",
    title: "Paid Newsletter Revenue Grew 138% Year-Over-Year",
    summary:
      "Beehiiv's annual report shows paid newsletter subscription revenue jumped from $8M to $19M, with solo creators averaging $2,400/month in subscription income.",
    source: "Beehiiv Blog",
    sourceUrl: "https://beehiiv.com/blog",
    relevanceScore: 94,
    publishedAt: "1 day ago",
    category: "Creator Economy",
    isBookmarked: true,
  },
  {
    id: "6",
    title: "Why AI-First Companies Are Winning the SaaS Race",
    summary:
      "Analysis of 500+ SaaS companies shows AI-native products convert at 47% vs 25% for traditional SaaS. The key differentiator is time-to-value under 5 minutes.",
    source: "First Round Review",
    sourceUrl: "https://review.firstround.com",
    relevanceScore: 82,
    publishedAt: "1 day ago",
    category: "SaaS Growth",
    isBookmarked: false,
  },
  {
    id: "7",
    title: "Anthropic Raises $5B at $60B Valuation",
    summary:
      "Anthropic closed its latest funding round led by Google and Spark Capital. The company plans to invest heavily in Claude's enterprise capabilities and safety research.",
    source: "Bloomberg",
    sourceUrl: "https://bloomberg.com",
    relevanceScore: 79,
    publishedAt: "2 days ago",
    category: "AI & Machine Learning",
    isBookmarked: false,
  },
  {
    id: "8",
    title: "The Creator Middle Class Is Growing Faster Than Expected",
    summary:
      "New data shows creators earning $50K-$200K annually grew by 35% in 2025. Newsletter creators represent the fastest-growing segment, followed by course creators.",
    source: "Creator Economy Report",
    sourceUrl: "https://signalfire.com",
    relevanceScore: 90,
    publishedAt: "2 days ago",
    category: "Creator Economy",
    isBookmarked: false,
  },
];

export const drafts: Draft[] = [
  {
    id: "1",
    title: "Weekly AI Roundup: GPT-5, Anthropic Funding, and the Future of Reasoning",
    preview:
      "This week in AI was nothing short of extraordinary. OpenAI's GPT-5 launch marks a significant leap in reasoning capabilities, while Anthropic's massive funding round signals...",
    status: "draft",
    createdAt: "Today, 10:30 AM",
    updatedAt: "Today, 11:45 AM",
    wordCount: 1240,
    sourcesUsed: 5,
  },
  {
    id: "2",
    title: "SaaS Metrics That Matter in 2026: AI-Native vs Traditional",
    preview:
      "If you're building a SaaS product in 2026, the rules have changed. AI-native companies are commanding 3.6x higher revenue multiples than their traditional counterparts...",
    status: "review",
    createdAt: "Yesterday, 2:15 PM",
    updatedAt: "Yesterday, 5:30 PM",
    wordCount: 980,
    sourcesUsed: 3,
  },
  {
    id: "3",
    title: "The Newsletter Creator's Guide to Monetization",
    preview:
      "Paid newsletter revenue grew 138% last year. But the real story isn't about the top 1% — it's about the growing middle class of creators earning sustainable income...",
    status: "scheduled",
    createdAt: "Feb 5, 2026",
    updatedAt: "Feb 6, 2026",
    wordCount: 1560,
    sourcesUsed: 4,
  },
  {
    id: "4",
    title: "Frontend Trends: What's Hot in Web Dev This Week",
    preview:
      "Next.js 15.2 just dropped with some exciting features. Server Actions streaming is a game-changer for forms, and the new dev tools overlay makes debugging...",
    status: "published",
    createdAt: "Feb 3, 2026",
    updatedAt: "Feb 3, 2026",
    wordCount: 870,
    sourcesUsed: 3,
  },
  {
    id: "5",
    title: "Startup Funding Digest: February Week 1",
    preview:
      "This week's biggest rounds: Anthropic ($5B), Runway ($1.2B), and three stealth AI startups that just emerged from hiding. Here's what it all means...",
    status: "published",
    createdAt: "Feb 1, 2026",
    updatedAt: "Feb 1, 2026",
    wordCount: 1100,
    sourcesUsed: 6,
  },
];

export const recentActivity = [
  { type: "curated", message: "38 new articles curated for AI & Machine Learning", time: "2 hours ago" },
  { type: "draft", message: "Draft generated: Weekly AI Roundup", time: "3 hours ago" },
  { type: "published", message: "Published: Frontend Trends newsletter", time: "4 days ago" },
  { type: "topic", message: "New topic added: Startup Funding", time: "5 days ago" },
  { type: "curated", message: "22 articles curated for SaaS Growth", time: "1 week ago" },
];

export const draftContent = `# Weekly AI Roundup: GPT-5, Anthropic Funding, and the Future of Reasoning

This week in AI was nothing short of extraordinary. Let me break down the three biggest stories that matter for builders and founders.

## GPT-5 Is Here, and It's a Reasoning Machine

OpenAI officially launched GPT-5, and the headline feature is a massive leap in multi-step reasoning. We're talking about a model that can hold complex chains of logic across thousands of tokens without losing the thread.

**Why this matters for you:** If you're building AI-powered products, GPT-5's improved reasoning means fewer hallucinations and more reliable outputs for complex tasks — think code generation, legal analysis, and financial modeling.

## Anthropic's $5B Round Signals an AI Arms Race

Anthropic just closed a $5B funding round at a $60B valuation, led by Google and Spark Capital. This isn't just about building better models — it's about the infrastructure and safety research needed to deploy AI at scale.

**The bigger picture:** We're seeing a clear bifurcation in the AI market. The foundation model layer is becoming a capital-intensive oligopoly, while the application layer remains wide open for indie builders.

## The Newsletter Creator Economy Is Booming

Beehiiv's annual report dropped some jaw-dropping numbers: paid newsletter subscription revenue grew 138% year-over-year, jumping from $8M to $19M. Solo creators are averaging $2,400/month in subscription income.

**Key takeaway:** The creator middle class is real and growing. If you've been thinking about starting a newsletter, the economics have never been better.

---

*That's a wrap for this week. Reply to this email with what you'd like me to cover next week.*
`;
