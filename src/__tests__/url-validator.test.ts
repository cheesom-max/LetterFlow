import { describe, it, expect, vi, beforeEach } from 'vitest';

// dns 모듈을 모킹
vi.mock('dns/promises', () => ({
  default: {
    lookup: vi.fn(),
  },
}));

import { validateRSSUrl } from '@/lib/url-validator';
import dns from 'dns/promises';

const mockedDnsLookup = vi.mocked(dns.lookup);

describe('validateRSSUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 정상적인 URL ---
  it('정상적인 HTTPS URL을 허용한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '93.184.216.34', family: 4 } as never);
    const result = await validateRSSUrl('https://example.com/feed');
    expect(result.valid).toBe(true);
  });

  it('정상적인 HTTP URL을 허용한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '93.184.216.34', family: 4 } as never);
    const result = await validateRSSUrl('http://example.com/rss');
    expect(result.valid).toBe(true);
  });

  // --- 잘못된 URL 형식 ---
  it('유효하지 않은 URL을 거부한다', async () => {
    const result = await validateRSSUrl('not-a-url');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid URL');
  });

  it('FTP 프로토콜을 거부한다', async () => {
    const result = await validateRSSUrl('ftp://example.com/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Only HTTP/HTTPS protocols allowed');
  });

  it('javascript: 프로토콜을 거부한다', async () => {
    const result = await validateRSSUrl('javascript:alert(1)');
    expect(result.valid).toBe(false);
  });

  it('file: 프로토콜을 거부한다', async () => {
    const result = await validateRSSUrl('file:///etc/passwd');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Only HTTP/HTTPS protocols allowed');
  });

  // --- SSRF 방지: 프라이빗 IP 차단 ---
  it('127.0.0.1 (loopback)을 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '127.0.0.1', family: 4 } as never);
    const result = await validateRSSUrl('https://localhost/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('10.x.x.x (Class A private)를 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '10.0.0.1', family: 4 } as never);
    const result = await validateRSSUrl('https://internal.corp/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('172.16.x.x (Class B private)를 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '172.16.0.1', family: 4 } as never);
    const result = await validateRSSUrl('https://internal.corp/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('192.168.x.x (Class C private)를 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '192.168.1.1', family: 4 } as never);
    const result = await validateRSSUrl('https://router.local/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('169.254.x.x (link-local / AWS metadata)를 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '169.254.169.254', family: 4 } as never);
    const result = await validateRSSUrl('https://metadata.aws/latest');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('0.0.0.0을 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '0.0.0.0', family: 4 } as never);
    const result = await validateRSSUrl('https://zero.example.com/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('IPv6 loopback (::1)을 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '::1', family: 6 } as never);
    const result = await validateRSSUrl('https://localhost6/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  it('IPv4-mapped IPv6 (::ffff:127.0.0.1)를 차단한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '::ffff:127.0.0.1', family: 6 } as never);
    const result = await validateRSSUrl('https://mapped.local/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('URL resolves to a private IP address');
  });

  // --- 172.x.x.x 경계 테스트 ---
  it('172.15.x.x (public 범위)는 허용한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '172.15.0.1', family: 4 } as never);
    const result = await validateRSSUrl('https://public172.example.com/feed');
    expect(result.valid).toBe(true);
  });

  it('172.32.x.x (public 범위)는 허용한다', async () => {
    mockedDnsLookup.mockResolvedValue({ address: '172.32.0.1', family: 4 } as never);
    const result = await validateRSSUrl('https://public172-32.example.com/feed');
    expect(result.valid).toBe(true);
  });

  // --- DNS 해석 실패 ---
  it('DNS 해석 실패 시 거부한다', async () => {
    mockedDnsLookup.mockRejectedValue(new Error('DNS resolution failed'));
    const result = await validateRSSUrl('https://nonexistent.invalid/feed');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Cannot resolve hostname');
  });
});
