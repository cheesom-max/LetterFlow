export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  newsletter_name: string | null;
  plan: "free" | "starter" | "pro" | "team";
  style_profile: string | null;
  created_at: string;
};

export type Topic = {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  rss_urls: string[];
  category: string;
  is_active: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  user_id: string;
  topic_id: string;
  title: string;
  summary: string;
  source: string;
  source_url: string;
  relevance_score: number;
  is_bookmarked: boolean;
  published_at: string;
  created_at: string;
};

export type Draft = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: "draft" | "review" | "scheduled" | "published";
  word_count: number;
  sources_used: number;
  created_at: string;
  updated_at: string;
};

export type DraftArticle = {
  id: string;
  draft_id: string;
  article_id: string;
  created_at: string;
};

export type PlatformConnection = {
  id: string;
  user_id: string;
  platform: "beehiiv" | "substack" | "kit";
  api_key: string;
  publication_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type PublishHistory = {
  id: string;
  draft_id: string;
  user_id: string;
  platform: "beehiiv" | "substack" | "kit";
  platform_post_id: string | null;
  platform_url: string | null;
  status: "success" | "failed";
  error_message: string | null;
  published_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "created_at">>;
        Relationships: [];
      };
      topics: {
        Row: Topic;
        Insert: Omit<Topic, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Topic, "id" | "created_at">>;
        Relationships: [];
      };
      articles: {
        Row: Article;
        Insert: Omit<Article, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Article, "id" | "created_at">>;
        Relationships: [];
      };
      drafts: {
        Row: Draft;
        Insert: Omit<Draft, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Draft, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      draft_articles: {
        Row: DraftArticle;
        Insert: Omit<DraftArticle, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<DraftArticle, "id" | "created_at">>;
        Relationships: [];
      };
      platform_connections: {
        Row: PlatformConnection;
        Insert: Omit<PlatformConnection, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<PlatformConnection, "id" | "created_at">>;
        Relationships: [];
      };
      publish_history: {
        Row: PublishHistory;
        Insert: Omit<PublishHistory, "id" | "published_at" | "platform_post_id" | "platform_url" | "error_message" | "status"> & {
          id?: string;
          published_at?: string;
          platform_post_id?: string | null;
          platform_url?: string | null;
          error_message?: string | null;
          status?: "success" | "failed";
        };
        Update: Partial<Omit<PublishHistory, "id" | "published_at">>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
