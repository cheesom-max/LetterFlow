import { describe, it, expect, vi } from 'vitest';
import { PLAN_LIMITS } from '@/lib/plan-limits';

describe('PLAN_LIMITS', () => {
  // --- 요금제별 기능 한도 정합성 검증 ---
  it('Free 요금제의 한도가 mvp_spec.md와 일치한다', () => {
    expect(PLAN_LIMITS.free).toEqual({
      curations: 2,
      drafts: 2,
      topics: 1,
      platforms: 0,
      styleLearning: false,
    });
  });

  it('Starter 요금제의 한도가 mvp_spec.md와 일치한다', () => {
    expect(PLAN_LIMITS.starter).toEqual({
      curations: 8,
      drafts: 8,
      topics: 3,
      platforms: 1,
      styleLearning: true,
    });
  });

  it('Pro 요금제는 무제한 큐레이션과 드래프트를 허용한다', () => {
    expect(PLAN_LIMITS.pro.curations).toBe(-1);
    expect(PLAN_LIMITS.pro.drafts).toBe(-1);
    expect(PLAN_LIMITS.pro.topics).toBe(10);
    expect(PLAN_LIMITS.pro.platforms).toBe(3);
    expect(PLAN_LIMITS.pro.styleLearning).toBe(true);
  });

  it('Team 요금제는 Pro와 동일한 한도를 가진다', () => {
    expect(PLAN_LIMITS.team).toEqual(PLAN_LIMITS.pro);
  });
});

describe('checkPlanLimit (비즈니스 로직)', () => {
  it('모든 요금제가 정의되어 있다', () => {
    const plans = ['free', 'starter', 'pro', 'team'] as const;
    for (const plan of plans) {
      expect(PLAN_LIMITS[plan]).toBeDefined();
    }
  });

  it('모든 기능이 모든 요금제에 정의되어 있다', () => {
    const features = ['curations', 'drafts', 'topics', 'platforms', 'styleLearning'] as const;
    const plans = ['free', 'starter', 'pro', 'team'] as const;

    for (const plan of plans) {
      for (const feature of features) {
        expect(PLAN_LIMITS[plan][feature]).toBeDefined();
      }
    }
  });

  it('무제한은 -1로 표현된다', () => {
    expect(PLAN_LIMITS.pro.curations).toBe(-1);
    expect(PLAN_LIMITS.pro.drafts).toBe(-1);
    // topics, platforms은 무제한이 아니라 숫자 한도
    expect(typeof PLAN_LIMITS.pro.topics).toBe('number');
    expect(PLAN_LIMITS.pro.topics).toBeGreaterThan(0);
  });

  it('요금제 한도는 상위 플랜으로 갈수록 증가한다', () => {
    const getCurationLimit = (plan: keyof typeof PLAN_LIMITS) => {
      const v = PLAN_LIMITS[plan].curations;
      return v === -1 ? Infinity : (v as number);
    };

    expect(getCurationLimit('free')).toBeLessThan(getCurationLimit('starter'));
    expect(getCurationLimit('starter')).toBeLessThan(getCurationLimit('pro'));
    expect(getCurationLimit('pro')).toBe(Infinity);
  });
});
