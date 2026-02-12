import { describe, it, expect } from 'vitest';
import { formatDate, countWords } from '@/lib/utils';

describe('formatDate', () => {
  it('1시간 미만 차이면 "Just now"을 반환한다', () => {
    const now = new Date().toISOString();
    expect(formatDate(now)).toBe('Just now');
  });

  it('1시간 이상 24시간 미만 차이면 시간 형식으로 반환한다', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatDate(twoHoursAgo)).toBe('2h ago');
  });

  it('1일 이상 7일 미만 차이면 일 형식으로 반환한다', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatDate(threeDaysAgo)).toBe('3d ago');
  });

  it('7일 이상이면 날짜 형식으로 반환한다', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatDate(twoWeeksAgo);
    // "Jan 28" 형태의 문자열을 확인
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
  });
});

describe('countWords', () => {
  it('정상적인 문자열의 단어 수를 반환한다', () => {
    expect(countWords('hello world')).toBe(2);
  });

  it('빈 문자열은 0을 반환한다', () => {
    expect(countWords('')).toBe(0);
  });

  it('공백만 있는 문자열은 0을 반환한다', () => {
    expect(countWords('   ')).toBe(0);
  });

  it('여러 공백으로 구분된 단어를 정확히 센다', () => {
    expect(countWords('hello    world   test')).toBe(3);
  });

  it('줄바꿈과 탭이 포함된 문자열을 처리한다', () => {
    expect(countWords('hello\nworld\ttab')).toBe(3);
  });

  it('마크다운 형식의 콘텐츠 단어 수를 센다', () => {
    const markdown = '# Title\n\nThis is **bold** and *italic* content.';
    expect(countWords(markdown)).toBe(8);
  });
});
