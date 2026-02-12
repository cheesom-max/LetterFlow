// In-memory rate limiter for API routes.
// Tracks requests per identifier (user ID or IP) within a sliding window.
// For production with multiple instances, replace with Upstash Rate Limit or Redis.

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterMs: number | null;
}

/**
 * Check and consume a rate limit token for the given identifier.
 *
 * @param identifier - Unique key (e.g., user ID or IP address)
 * @param maxRequests - Maximum requests allowed within the window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number = 60_000
): RateLimitResult {
  cleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(identifier);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(identifier, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      retryAfterMs,
    };
  }

  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    limit: maxRequests,
    retryAfterMs: null,
  };
}

// Rate limit presets per route type
export const RATE_LIMITS = {
  // AI-heavy routes (OpenAI API calls) - stricter limits
  AI_ROUTE: { maxRequests: 10, windowMs: 60_000 },
  // Standard API routes
  STANDARD_ROUTE: { maxRequests: 30, windowMs: 60_000 },
} as const;

// Exported for testing
export function _clearStore() {
  store.clear();
}
