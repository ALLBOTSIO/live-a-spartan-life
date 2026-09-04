import { z } from 'zod'

/**
 * Runtime validation for external configuration.
 *
 * Every integration is optional at build time so the site can be deployed and
 * previewed before keys exist. Each server module calls its own `require*`
 * helper and fails loudly — with a message naming the missing variable — only
 * when the feature is actually exercised.
 */

/**
 * Production canonical URL for liveaspartanlife.com.
 * Used as fallback when NEXT_PUBLIC_SITE_URL is not explicitly set.
 */
const PRODUCTION_SITE_URL = 'https://www.liveaspartanlife.com'

/**
 * Check if a URL is localhost (the likely misconfig that caused the original bug).
 */
function isLocalhostUrl(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1')
}

/**
 * Infer the site URL with production-first logic.
 * 
 * Priority:
 * 1. Explicit NEXT_PUBLIC_SITE_URL (unless it's localhost in production)
 * 2. Production canonical URL when VERCEL_ENV is production
 * 3. Vercel preview URL for branch deploys
 * 4. Localhost for local development
 * 
 * Hardening: If NEXT_PUBLIC_SITE_URL is set to localhost/127.0.0.1 in production,
 * treat it as unset and use the canonical URL. This prevents misconfigurations
 * from leaking localhost URLs into production robots.txt and sitemap.xml.
 */
function inferSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  
  // If explicitly set to a non-localhost URL, use it
  if (explicit && !isLocalhostUrl(explicit)) {
    return explicit
  }
  
  // Production builds use canonical URL (even if env is set to localhost)
  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_SITE_URL
  }
  
  // If localhost was set explicitly in non-production, honor it
  if (explicit) {
    return explicit
  }
  
  // Preview/branch deploys use Vercel-provided URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Local development
  return 'http://localhost:3000'
}

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_BROTHERHOOD_PRICE_ID: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).default('JROC <jroc@liveaspartanlife.com>'),
  RESEND_AUDIENCE_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://us.i.posthog.com'),
  NEXT_PUBLIC_FEATURE_SCANLINE: z.string().optional(),
})

export const env = serverSchema.parse({
  NEXT_PUBLIC_SITE_URL: inferSiteUrl(),
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_BROTHERHOOD_PRICE_ID: process.env.STRIPE_BROTHERHOOD_PRICE_ID,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_FEATURE_SCANLINE: process.env.NEXT_PUBLIC_FEATURE_SCANLINE,
})

/** The scanline texture overlay ships behind a flag. Default: on. */
export const scanlineEnabled = env.NEXT_PUBLIC_FEATURE_SCANLINE !== 'false'

export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key]
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable ${key}. Add it to .env.local (see .env.example).`,
    )
  }
  return value as NonNullable<(typeof env)[K]>
}

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
export const isStripeConfigured = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_BROTHERHOOD_PRICE_ID)
export const isResendConfigured = Boolean(env.RESEND_API_KEY)

/**
 * Get the canonical site URL for robots.txt, sitemap.xml, and metadataBase.
 * Always returns production URL in production builds, even if env is misconfigured.
 */
export function getSiteUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL
}
