import 'server-only'

/**
 * Minimal in-memory rate limit for the public signup endpoints.
 *
 * Good enough to blunt a casual flood on a single instance; it is deliberately
 * not a distributed limiter. If abuse becomes real, move this to Upstash or
 * Vercel KV — the call signature is designed to survive that swap.
 */
const WINDOW_MS = 60_000
const MAX_REQUESTS = 8

const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k)
    }
    return { ok: true, retryAfterSeconds: 0 }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfterSeconds: 0 }
}

export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return `${scope}:${ip}`
}
