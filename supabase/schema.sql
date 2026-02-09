-- LetterFlow Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- ============================================================
-- 1. Profiles (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  newsletter_name text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'team')),
  style_profile text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- 2. Topics
-- ============================================================
create table public.topics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  keywords text[] default '{}',
  rss_urls text[] default '{}',
  category text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.topics enable row level security;
create policy "Users can manage own topics" on public.topics for all using (auth.uid() = user_id);

-- ============================================================
-- 3. Articles (curated content)
-- ============================================================
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic_id uuid references public.topics(id) on delete cascade not null,
  title text not null,
  summary text,
  source text not null,
  source_url text not null,
  relevance_score integer default 0 check (relevance_score between 0 and 100),
  is_bookmarked boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table public.articles enable row level security;
create policy "Users can manage own articles" on public.articles for all using (auth.uid() = user_id);

-- ============================================================
-- 4. Drafts
-- ============================================================
create table public.drafts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text default '',
  status text default 'draft' check (status in ('draft', 'review', 'scheduled', 'published')),
  word_count integer default 0,
  sources_used integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.drafts enable row level security;
create policy "Users can manage own drafts" on public.drafts for all using (auth.uid() = user_id);

-- ============================================================
-- 5. Draft ↔ Article 중간 테이블 (M:N 정규화)
-- ============================================================
create table public.draft_articles (
  id uuid default gen_random_uuid() primary key,
  draft_id uuid references public.drafts(id) on delete cascade not null,
  article_id uuid references public.articles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(draft_id, article_id)
);

alter table public.draft_articles enable row level security;
create policy "Users can manage own draft_articles" on public.draft_articles
  for all using (
    exists (
      select 1 from public.drafts where id = draft_id and user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. Platform Connections
-- ============================================================
create table public.platform_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('beehiiv', 'substack', 'kit')),
  api_key text not null,
  publication_id text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.platform_connections enable row level security;
create policy "Users can manage own connections" on public.platform_connections for all using (auth.uid() = user_id);

-- ============================================================
-- 7. Publish History (발행 이력)
-- ============================================================
create table public.publish_history (
  id uuid default gen_random_uuid() primary key,
  draft_id uuid references public.drafts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('beehiiv', 'substack', 'kit')),
  platform_post_id text,
  platform_url text,
  status text default 'success' check (status in ('success', 'failed')),
  error_message text,
  published_at timestamptz default now()
);

alter table public.publish_history enable row level security;
create policy "Users can view own publish history" on public.publish_history
  for select using (auth.uid() = user_id);

-- ============================================================
-- 8. Indexes (주요 쿼리 패턴 최적화)
-- ============================================================

-- articles: 유저별 토픽별 기사 조회 (큐레이션 피드)
create index idx_articles_user_topic on public.articles(user_id, topic_id);

-- articles: 관련도 정렬
create index idx_articles_relevance on public.articles(relevance_score desc);

-- articles: 동일 유저의 중복 기사 방지
create unique index idx_articles_unique_source on public.articles(user_id, source_url);

-- drafts: 유저별 상태 필터
create index idx_drafts_user_status on public.drafts(user_id, status);

-- draft_articles: 드래프트별 기사 조회
create index idx_draft_articles_draft on public.draft_articles(draft_id);
create index idx_draft_articles_article on public.draft_articles(article_id);

-- platform_connections: 발행 시 연결 조회
create index idx_connections_user_platform on public.platform_connections(user_id, platform, is_active);

-- publish_history: 유저별 발행 이력 조회
create index idx_publish_history_user on public.publish_history(user_id, published_at desc);
create index idx_publish_history_draft on public.publish_history(draft_id);

-- ============================================================
-- 9. Triggers
-- ============================================================

-- updated_at 자동 갱신 트리거
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_drafts_updated_at
  before update on public.drafts
  for each row execute procedure public.update_updated_at();

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
