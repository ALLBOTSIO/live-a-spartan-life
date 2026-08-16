'use client'

import posthog from 'posthog-js'

/**
 * Thin wrapper so components never import PostHog directly and never crash when
 * analytics is unconfigured (local dev, previews, or a client who hasn't
 * provisioned a project yet).
 */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  try {
    posthog.capture(event, properties)
  } catch {
    // Analytics must never break a conversion path.
  }
}
