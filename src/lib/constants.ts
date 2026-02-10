// OpenAI Model Configuration
export const OPENAI_MODELS = {
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
} as const;

// OpenAI Parameters per function
export const OPENAI_PARAMS = {
  SUMMARIZE: { maxTokens: 200, temperature: 0.3 },
  SCORE_RELEVANCE: { maxTokens: 10, temperature: 0 },
  GENERATE_DRAFT: { maxTokens: 2000, temperature: 0.7 },
  SUBJECT_LINES: { maxTokens: 300, temperature: 0.8 },
  REWRITE: { maxTokens: 2000, temperature: 0.7 },
  SHORTEN: { maxTokens: 1500, temperature: 0.3 },
  TLDR: { maxTokens: 200, temperature: 0.3 },
} as const;

// Draft Status Configuration
export const DRAFT_STATUS_MAP: Record<
  string,
  { variant: "default" | "success" | "warning" | "info"; label: string }
> = {
  draft: { variant: "default", label: "Draft" },
  review: { variant: "warning", label: "In Review" },
  scheduled: { variant: "info", label: "Scheduled" },
  published: { variant: "success", label: "Published" },
};

// Platform Configuration
export const PLATFORM_META: Record<
  string,
  { label: string; description: string; color: string }
> = {
  beehiiv: {
    label: "Beehiiv",
    description: "Connect your Beehiiv account to publish directly",
    color: "bg-amber-500",
  },
  substack: {
    label: "Substack",
    description: "Publish newsletters to your Substack",
    color: "bg-orange-500",
  },
  kit: {
    label: "Kit (ConvertKit)",
    description: "Send newsletters via Kit email platform",
    color: "bg-blue-500",
  },
};

// AI Transform Actions
export const AI_ACTIONS = ["rewrite", "shorten", "tldr"] as const;

// Default Style Profile
export const DEFAULT_STYLE_PROFILE =
  "Conversational, engaging tone with short paragraphs and bold key takeaways";

// API Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  MISSING_PARAMS: "Required parameters missing",
  NOT_FOUND: "Resource not found",
  AI_FAILED: "AI processing failed",
  PUBLISH_FAILED: "Failed to publish",
  CURATE_FAILED: "Failed to curate articles",
  DRAFT_FAILED: "Failed to generate draft",
} as const;

// Timing Configuration
export const TIMING = {
  DEBOUNCE_MS: 2000,
  SAVE_DISPLAY_MS: 2000,
  RSS_CACHE_SEC: 3600,
} as const;

// RSS Configuration
export const RSS_CONFIG = {
  MAX_ITEMS: 20,
  USER_AGENT: "LetterFlow/1.0",
} as const;

// Interest Options for onboarding
export const INTEREST_OPTIONS = [
  "Technology",
  "Business",
  "Creator",
  "Marketing",
  "Finance",
  "AI & ML",
  "Design",
  "Startup",
] as const;
