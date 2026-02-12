import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, RATE_LIMITS, _clearStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    _clearStore();
  });

  it("allows requests within the limit", () => {
    const result = checkRateLimit("user-1", 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.limit).toBe(5);
    expect(result.retryAfterMs).toBeNull();
  });

  it("tracks remaining count down to zero then blocks", () => {
    const first = checkRateLimit("user-1", 3, 60_000);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit("user-1", 3, 60_000);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit("user-1", 3, 60_000);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    // 4th call should be blocked
    const fourth = checkRateLimit("user-1", 3, 60_000);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
    expect(fourth.limit).toBe(3);
    expect(fourth.retryAfterMs).toBeGreaterThan(0);
  });

  it("blocks requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("user-2", 5, 60_000);
    }

    const result = checkRateLimit("user-2", 5, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("isolates rate limits per identifier", () => {
    for (let i = 0; i < 3; i++) {
      checkRateLimit("user-a", 3, 60_000);
    }

    const resultA = checkRateLimit("user-a", 3, 60_000);
    const resultB = checkRateLimit("user-b", 3, 60_000);

    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
    expect(resultB.remaining).toBe(2);
  });

  it("provides retryAfterMs when limit is exceeded", () => {
    for (let i = 0; i < 2; i++) {
      checkRateLimit("user-3", 2, 60_000);
    }

    const result = checkRateLimit("user-3", 2, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
    expect(result.retryAfterMs).toBeLessThanOrEqual(60_000);
  });

  it("allows requests again after window expires", async () => {
    // Use a very short window (50ms) to test expiration
    checkRateLimit("user-4", 1, 50);

    const blocked = checkRateLimit("user-4", 1, 50);
    expect(blocked.allowed).toBe(false);

    // Wait for the window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    const allowed = checkRateLimit("user-4", 1, 50);
    expect(allowed.allowed).toBe(true);
  });

  it("handles a limit of 1 correctly", () => {
    const first = checkRateLimit("user-5", 1, 60_000);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(0);

    const second = checkRateLimit("user-5", 1, 60_000);
    expect(second.allowed).toBe(false);
  });

  it("handles a large number of requests correctly", () => {
    for (let i = 0; i < 100; i++) {
      checkRateLimit("user-6", 100, 60_000);
    }

    const result = checkRateLimit("user-6", 100, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

describe("RATE_LIMITS presets", () => {
  it("defines AI_ROUTE limits", () => {
    expect(RATE_LIMITS.AI_ROUTE.maxRequests).toBe(10);
    expect(RATE_LIMITS.AI_ROUTE.windowMs).toBe(60_000);
  });

  it("defines STANDARD_ROUTE limits", () => {
    expect(RATE_LIMITS.STANDARD_ROUTE.maxRequests).toBe(30);
    expect(RATE_LIMITS.STANDARD_ROUTE.windowMs).toBe(60_000);
  });

  it("AI route is stricter than standard route", () => {
    expect(RATE_LIMITS.AI_ROUTE.maxRequests).toBeLessThan(RATE_LIMITS.STANDARD_ROUTE.maxRequests);
  });
});
