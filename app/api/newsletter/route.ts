import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sendNewsletterWelcome } from '@/lib/email'
import { isSupabaseConfigured } from '@/lib/env'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/server'
import { newsletterSignupSchema } from '@/lib/validation'

const bodySchema = newsletterSignupSchema.extend({
  source: z.enum(['homepage', 'start-page', 'field-notes', 'article']).default('field-notes'),
})

/** Field Notes newsletter — email only. Same contract as /api/starter. */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'newsletter'))
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Give it a minute.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  const { email, company, source } = parsed.data
  if (company) return NextResponse.json({ ok: true })

  const normalisedEmail = email.toLowerCase()

  if (!isSupabaseConfigured) {
    console.warn('[newsletter] Supabase not configured — signup not persisted', { source })
    return NextResponse.json(
      { error: 'Subscriptions are not available yet. Try again shortly.' },
      { status: 503 },
    )
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('subscribers').upsert(
      {
        email: normalisedEmail,
        source,
        newsletter_opt_in: true,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    )
    if (error) throw new Error(error.message)
  } catch (caught) {
    console.error('[newsletter] failed to persist subscriber', {
      message: caught instanceof Error ? caught.message : 'unknown',
    })
    return NextResponse.json(
      { error: 'We could not save that. Try again in a moment.' },
      { status: 500 },
    )
  }

  const result = await sendNewsletterWelcome({ email: normalisedEmail })
  if (!result.sent && result.reason !== 'resend-not-configured') {
    console.error('[newsletter] welcome email failed', { reason: result.reason })
  }

  return NextResponse.json({ ok: true })
}
