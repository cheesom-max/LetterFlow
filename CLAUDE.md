# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (Turbopack)
npm run lint     # ESLint
```

## Architecture

LetterFlow is an AI-powered newsletter curation and drafting SaaS. Users add topics with RSS feeds, AI curates and summarizes articles, generates newsletter drafts, and publishes to platforms (Beehiiv, Kit).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Supabase (auth + PostgreSQL + RLS) · OpenAI (GPT-4o / GPT-4o-mini) · TailwindCSS 4

### Data Flow

```
Topics (RSS feeds) → /api/curate → Articles (AI summarized + scored)
                                        ↓
Selected Articles → /api/generate-draft → Drafts (AI generated)
                                              ↓
                   /api/ai-transform ← Editor (auto-save, AI assist)
                                              ↓
                   /api/publish → Beehiiv / Kit (as draft for review)
```

### Three Supabase Clients

- `src/lib/supabase.ts` — Browser client (`createBrowserClient`)
- `src/lib/supabase-server.ts` — Server Components (`cookies()` API, can set cookies)
- `src/lib/supabase-api.ts` — API Routes (`getAuthenticatedUser(request)`, read-only cookies)

### API Route Pattern

All routes in `src/app/api/*/route.ts` follow:
1. `getAuthenticatedUser(request)` → 401 if unauthenticated
2. `checkPlanLimit(supabase, user.id, feature)` → 403 if over limit
3. Business logic with Supabase queries (RLS filters by `user_id`)
4. `try/catch` with `console.error` + JSON error response

### Plan Enforcement

`src/lib/plan-limits.ts` — DB-count-based usage limits per plan (free/starter/pro/team). Enforced in API routes and client-side hooks. Limits defined in `PLAN_LIMITS` constant, checked via `checkPlanLimit()`.

### OpenAI Functions

`src/lib/openai.ts` — All AI calls centralized. Models and params configured in `src/lib/constants.ts` (`OPENAI_MODELS`, `OPENAI_PARAMS`). Functions: `summarizeArticle`, `scoreRelevance`, `generateDraft`, `generateSubjectLines`, `rewriteInStyle`, `makeShorter`, `generateTldr`, `analyzeWritingStyle`.

### Custom Hooks

Each hook in `src/hooks/` wraps Supabase queries with loading/error state:
- `useUser` — Auth state with `onAuthStateChange` subscription
- `useArticles` — Feed with filters, bookmark toggle, curate action
- `useDraft` — Single draft with 2s debounced auto-save
- `useDrafts` — Draft list with status filtering
- `useTopics` — CRUD with article count aggregation and plan limit check
- `useStats` — Dashboard counts and recent activity

### Auth Flow

Middleware (`src/middleware.ts`) protects `/dashboard/*` (redirect) and `/api/*` (401). Auth via Supabase: email/password + Google OAuth. Callback at `/auth/callback` checks onboarding status.

### Database

Schema in `supabase/schema.sql`. 7 tables with RLS. Types hand-written in `src/lib/database.types.ts`. Key: all user data scoped by `user_id`, `draft_articles` is M:N junction, `publish_history` tracks success/failure.

### Publishing

`src/app/api/publish/route.ts` — Markdown → HTML (marked + sanitize-html) → Platform API. Beehiiv and Kit supported. Substack marked Coming Soon (no public API).

### Security

- URL validator (`src/lib/url-validator.ts`) blocks SSRF on RSS feeds (private IP check)
- All DB tables have Row-Level Security policies
- Middleware enforces auth on all protected routes

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`
Optional: `SUPABASE_SERVICE_ROLE_KEY`, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`
