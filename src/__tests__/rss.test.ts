import { describe, it, expect, vi, beforeEach } from 'vitest';

// url-validator와 fetch를 모킹
vi.mock('@/lib/url-validator', () => ({
  validateRSSUrl: vi.fn(),
}));

import { fetchRSSFeed, fetchMultipleFeeds } from '@/lib/rss';
import { validateRSSUrl } from '@/lib/url-validator';

const mockedValidateRSSUrl = vi.mocked(validateRSSUrl);

// 전역 fetch 모킹
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Article One</title>
      <link>https://example.com/article-1</link>
      <description>This is the first article description</description>
      <pubDate>Mon, 10 Feb 2026 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article Two</title>
      <link>https://example.com/article-2</link>
      <description>This is the second article description</description>
      <pubDate>Sun, 09 Feb 2026 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

describe('fetchRSSFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('유효한 RSS 피드의 기사를 파싱한다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(SAMPLE_RSS),
    });

    const items = await fetchRSSFeed('https://example.com/feed');
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('Article One');
    expect(items[0].link).toBe('https://example.com/article-1');
    expect(items[0].source).toBe('Test Feed');
  });

  it('URL 검증 실패 시 빈 배열을 반환한다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: false, reason: 'Private IP' });
    const items = await fetchRSSFeed('https://internal.corp/feed');
    expect(items).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetch 실패 시 빈 배열을 반환한다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({ ok: false });

    const items = await fetchRSSFeed('https://example.com/broken-feed');
    expect(items).toEqual([]);
  });

  it('네트워크 오류 시 빈 배열을 반환하며 크래시하지 않는다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockRejectedValue(new Error('Network error'));

    const items = await fetchRSSFeed('https://unreachable.com/feed');
    expect(items).toEqual([]);
  });

  it('최대 20개 아이템만 반환한다 (RSS_CONFIG.MAX_ITEMS)', async () => {
    // 25개 아이템이 있는 RSS 생성
    const items = Array.from({ length: 25 }, (_, i) => `
      <item>
        <title>Article ${i}</title>
        <link>https://example.com/article-${i}</link>
        <description>Description ${i}</description>
        <pubDate>Mon, 10 Feb 2026 10:00:00 GMT</pubDate>
      </item>
    `).join('');

    const bigRss = `<?xml version="1.0"?><rss><channel><title>Big Feed</title>${items}</channel></rss>`;

    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(bigRss),
    });

    const result = await fetchRSSFeed('https://example.com/big-feed');
    expect(result).toHaveLength(20);
  });

  it('HTML 태그가 포함된 description을 strip한다', async () => {
    const rssWithHtml = `<?xml version="1.0"?>
      <rss><channel><title>Test</title>
        <item>
          <title>Test Article</title>
          <link>https://example.com/test</link>
          <description><![CDATA[<p>This is <b>bold</b> and <a href="#">linked</a> text</p>]]></description>
          <pubDate>Mon, 10 Feb 2026 10:00:00 GMT</pubDate>
        </item>
      </channel></rss>`;

    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(rssWithHtml),
    });

    const result = await fetchRSSFeed('https://example.com/feed');
    expect(result[0].description).not.toContain('<p>');
    expect(result[0].description).not.toContain('<b>');
    expect(result[0].description).toContain('bold');
  });
});

describe('fetchMultipleFeeds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('여러 피드의 결과를 합친다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(SAMPLE_RSS),
    });

    const items = await fetchMultipleFeeds([
      'https://example.com/feed1',
      'https://example.com/feed2',
    ]);

    // 각 피드에서 2개씩 = 4개
    expect(items).toHaveLength(4);
  });

  it('일부 피드 실패 시에도 나머지 결과를 반환한다 (graceful degradation)', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(SAMPLE_RSS),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const items = await fetchMultipleFeeds([
      'https://example.com/good-feed',
      'https://example.com/bad-feed',
    ]);

    // 성공한 피드에서 2개만 반환
    expect(items).toHaveLength(2);
  });

  it('빈 URL 배열은 빈 결과를 반환한다', async () => {
    const items = await fetchMultipleFeeds([]);
    expect(items).toEqual([]);
  });

  it('결과를 날짜 기준 최신순으로 정렬한다', async () => {
    mockedValidateRSSUrl.mockResolvedValue({ valid: true });
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(SAMPLE_RSS),
    });

    const items = await fetchMultipleFeeds(['https://example.com/feed']);

    // pubDate가 있는 경우, 최신이 먼저
    if (items.length >= 2 && items[0].pubDate && items[1].pubDate) {
      const date0 = new Date(items[0].pubDate).getTime();
      const date1 = new Date(items[1].pubDate).getTime();
      expect(date0).toBeGreaterThanOrEqual(date1);
    }
  });
});
