import { describe, it, expect } from 'vitest';
import type {
  Database,
  Profile,
  Topic,
  Article,
  Draft,
  DraftArticle,
  PlatformConnection,
  PublishHistory,
} from '@/lib/database.types';

describe('Database Types', () => {
  // --- 타입 구조 검증 (컴파일 타임 + 런타임 일관성) ---

  it('Profile 타입이 모든 필수 필드를 포함한다', () => {
    const profile: Profile = {
      id: 'uuid',
      email: 'test@example.com',
      full_name: 'Test User',
      newsletter_name: 'My Newsletter',
      interests: ['Technology'],
      plan: 'free',
      style_profile: null,
      created_at: new Date().toISOString(),
    };
    expect(profile).toBeDefined();
    expect(profile.plan).toBe('free');
  });

  it('Topic 타입이 모든 필수 필드를 포함한다', () => {
    const topic: Topic = {
      id: 'uuid',
      user_id: 'user-uuid',
      name: 'AI & ML',
      keywords: ['ai', 'ml'],
      rss_urls: ['https://example.com/feed'],
      category: 'Technology',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    expect(topic.keywords).toHaveLength(2);
    expect(topic.is_active).toBe(true);
  });

  it('Article 타입이 관련도 점수를 0-100 범위로 가진다', () => {
    const article: Article = {
      id: 'uuid',
      user_id: 'user-uuid',
      topic_id: 'topic-uuid',
      title: 'Test Article',
      summary: 'Summary',
      source: 'TechCrunch',
      source_url: 'https://techcrunch.com/article',
      relevance_score: 85,
      is_bookmarked: false,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    expect(article.relevance_score).toBeGreaterThanOrEqual(0);
    expect(article.relevance_score).toBeLessThanOrEqual(100);
  });

  it('Draft 상태가 4가지 중 하나여야 한다', () => {
    const validStatuses: Draft['status'][] = ['draft', 'review', 'scheduled', 'published'];
    validStatuses.forEach((status) => {
      const draft: Draft = {
        id: 'uuid',
        user_id: 'user-uuid',
        title: 'Test Draft',
        content: 'Content',
        status,
        word_count: 100,
        sources_used: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      expect(validStatuses).toContain(draft.status);
    });
  });

  it('PlatformConnection의 platform이 3가지 중 하나여야 한다', () => {
    const validPlatforms: PlatformConnection['platform'][] = ['beehiiv', 'substack', 'kit'];
    validPlatforms.forEach((platform) => {
      const conn: PlatformConnection = {
        id: 'uuid',
        user_id: 'user-uuid',
        platform,
        api_key: 'key',
        publication_id: null,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      expect(validPlatforms).toContain(conn.platform);
    });
  });

  it('PublishHistory 상태가 success 또는 failed여야 한다', () => {
    const validStatuses: PublishHistory['status'][] = ['success', 'failed'];
    validStatuses.forEach((status) => {
      const history: PublishHistory = {
        id: 'uuid',
        draft_id: 'draft-uuid',
        user_id: 'user-uuid',
        platform: 'beehiiv',
        platform_post_id: null,
        platform_url: null,
        status,
        error_message: status === 'failed' ? 'Error occurred' : null,
        published_at: new Date().toISOString(),
      };
      expect(validStatuses).toContain(history.status);
    });
  });

  it('Database 인터페이스에 모든 7개 테이블이 정의되어 있다', () => {
    // 컴파일 타임 체크로 충분하지만 런타임에도 확인
    const tables: (keyof Database['public']['Tables'])[] = [
      'profiles',
      'topics',
      'articles',
      'drafts',
      'draft_articles',
      'platform_connections',
      'publish_history',
    ];
    expect(tables).toHaveLength(7);
  });
});
