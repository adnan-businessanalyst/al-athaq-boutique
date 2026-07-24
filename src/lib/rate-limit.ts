type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory sliding window rate limiter for API routes.
 * Suitable for single-instance deployments (e.g. Replit).
 */
export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterMs: 0,
  };
}
