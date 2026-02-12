import { describe, it, expect } from 'vitest';
import {
  OPENAI_MODELS,
  OPENAI_PARAMS,
  DRAFT_STATUS_MAP,
  PLATFORM_META,
  AI_ACTIONS,
  ERROR_MESSAGES,
  TIMING,
  RSS_CONFIG,
  INTEREST_OPTIONS,
} from '@/lib/constants';

describe('OPENAI_MODELS', () => {
  it('GPT-4o 모델이 정의되어 있다', () => {
    expect(OPENAI_MODELS.GPT_4O).toBe('gpt-4o');
  });

  it('GPT-4o-mini 모델이 정의되어 있다', () => {
    expect(OPENAI_MODELS.GPT_4O_MINI).toBe('gpt-4o-mini');
  });
});

describe('OPENAI_PARAMS', () => {
  it('모든 함수에 대한 파라미터가 정의되어 있다', () => {
    const expectedFunctions = [
      'SUMMARIZE',
      'SCORE_RELEVANCE',
      'GENERATE_DRAFT',
      'SUBJECT_LINES',
      'REWRITE',
      'SHORTEN',
      'TLDR',
      'STYLE_ANALYSIS',
    ];

    for (const fn of expectedFunctions) {
      const params = OPENAI_PARAMS[fn as keyof typeof OPENAI_PARAMS];
      expect(params).toBeDefined();
      expect(params.maxTokens).toBeGreaterThan(0);
      expect(params.temperature).toBeGreaterThanOrEqual(0);
      expect(params.temperature).toBeLessThanOrEqual(1);
    }
  });

  it('요약 함수의 temperature가 0.3이다 (낮은 창의성)', () => {
    expect(OPENAI_PARAMS.SUMMARIZE.temperature).toBe(0.3);
  });

  it('점수 매기기는 temperature 0이다 (결정적)', () => {
    expect(OPENAI_PARAMS.SCORE_RELEVANCE.temperature).toBe(0);
  });

  it('드래프트 생성은 temperature 0.7이다 (높은 창의성)', () => {
    expect(OPENAI_PARAMS.GENERATE_DRAFT.temperature).toBe(0.7);
  });
});

describe('DRAFT_STATUS_MAP', () => {
  it('모든 상태에 variant와 label이 있다', () => {
    const statuses = ['draft', 'review', 'scheduled', 'published'];
    for (const status of statuses) {
      expect(DRAFT_STATUS_MAP[status]).toBeDefined();
      expect(DRAFT_STATUS_MAP[status].variant).toBeDefined();
      expect(DRAFT_STATUS_MAP[status].label).toBeDefined();
    }
  });
});

describe('PLATFORM_META', () => {
  it('Beehiiv, Substack, Kit 플랫폼이 정의되어 있다', () => {
    expect(PLATFORM_META.beehiiv).toBeDefined();
    expect(PLATFORM_META.substack).toBeDefined();
    expect(PLATFORM_META.kit).toBeDefined();
  });

  it('각 플랫폼에 label, description, color가 있다', () => {
    for (const platform of ['beehiiv', 'substack', 'kit']) {
      const meta = PLATFORM_META[platform];
      expect(meta.label).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.color).toBeTruthy();
    }
  });
});

describe('AI_ACTIONS', () => {
  it('rewrite, shorten, tldr 액션이 정의되어 있다', () => {
    expect(AI_ACTIONS).toContain('rewrite');
    expect(AI_ACTIONS).toContain('shorten');
    expect(AI_ACTIONS).toContain('tldr');
  });

  it('정확히 3개의 액션이 있다', () => {
    expect(AI_ACTIONS).toHaveLength(3);
  });
});

describe('ERROR_MESSAGES', () => {
  it('주요 에러 메시지가 정의되어 있다', () => {
    expect(ERROR_MESSAGES.UNAUTHORIZED).toBe('Unauthorized');
    expect(ERROR_MESSAGES.MISSING_PARAMS).toBeTruthy();
    expect(ERROR_MESSAGES.NOT_FOUND).toBeTruthy();
    expect(ERROR_MESSAGES.AI_FAILED).toBeTruthy();
    expect(ERROR_MESSAGES.PUBLISH_FAILED).toBeTruthy();
  });
});

describe('TIMING', () => {
  it('디바운스 시간이 2초이다', () => {
    expect(TIMING.DEBOUNCE_MS).toBe(2000);
  });

  it('RSS 캐시 시간이 1시간이다', () => {
    expect(TIMING.RSS_CACHE_SEC).toBe(3600);
  });
});

describe('RSS_CONFIG', () => {
  it('최대 아이템 수가 20개이다', () => {
    expect(RSS_CONFIG.MAX_ITEMS).toBe(20);
  });

  it('User-Agent가 설정되어 있다', () => {
    expect(RSS_CONFIG.USER_AGENT).toBeTruthy();
    expect(RSS_CONFIG.USER_AGENT).toContain('LetterFlow');
  });
});

describe('INTEREST_OPTIONS', () => {
  it('관심 분야 옵션이 8개이다', () => {
    expect(INTEREST_OPTIONS).toHaveLength(8);
  });

  it('Technology와 AI & ML이 포함되어 있다', () => {
    expect(INTEREST_OPTIONS).toContain('Technology');
    expect(INTEREST_OPTIONS).toContain('AI & ML');
  });
});
