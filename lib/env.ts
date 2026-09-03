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
 * Infer the production site URL when NEXT_PUBLIC_SITE_URL is not set.
 * Vercel sets VERCEL_URL automatically on every deployment.
 */
function inferSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
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
