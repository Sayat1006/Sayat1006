import "server-only";

/**
 * Minimal per-user cooldown between AI generations, to stop a single user
 * (or a buggy client retry loop) from firing dozens of simultaneous
 * requests. This is in-memory and per server process — good enough for a
 * single-instance deployment; a multi-instance deployment should replace
 * this with a shared store (e.g. Redis/Upstash) behind the same
 * checkGenerationRateLimit() signature.
 */
const lastRequestAt = new Map<string, number>();
const COOLDOWN_MS = 4000;
const MAX_TRACKED_USERS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkGenerationRateLimit(userId: string): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so this map can't grow without bound.
  if (lastRequestAt.size > MAX_TRACKED_USERS) {
    for (const [id, ts] of lastRequestAt) {
      if (now - ts > COOLDOWN_MS) lastRequestAt.delete(id);
    }
  }

  const last = lastRequestAt.get(userId);
  if (last && now - last < COOLDOWN_MS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((COOLDOWN_MS - (now - last)) / 1000) };
  }

  lastRequestAt.set(userId, now);
  return { allowed: true, retryAfterSeconds: 0 };
}
