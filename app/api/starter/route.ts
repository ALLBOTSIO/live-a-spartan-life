import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sendStarterWelcome } from '@/lib/email'
import { isSupabaseConfigured } from '@/lib/env'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/server'
import { starterSignupSchema } from '@/lib/validation'

const bodySchema = starterSignupSchema.extend({
  source: z.enum(['homepage', 'start-page', 'field-notes', 'article']).default('homepage'),
})

/**
 * Spartan Starter signup.
 *
 * Writes the subscriber to Supabase, then fires the Resend welcome. An existing
 * email is treated as success — re-submitting a form should never leak whether
 * an address is already on the list, and it should never look like a failure to
 * the man who just typed it in.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'starter'))
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
      { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.' },
      { status: 400 },
    )
  }

  const { email, firstName, company, source } = parsed.data

  // Honeypot filled — accept silently so the bot learns nothing.
  if (company) return NextResponse.json({ ok: true })

  const normalisedEmail = email.toLowerCase()
  const name = firstName?.trim() || null

  if (!isSupabaseConfigured) {
    console.warn('[starter] Supabase not configured — signup not persisted', { source })
    return NextResponse.json(
      { error: 'Signup is not available yet. Try again shortly.' },
      { status: 503 },
    )
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('subscribers').upsert(
      {
        email: normalisedEmail,
        first_name: name,
        source,
        starter_requested_at: new Date().toISOString(),
        newsletter_opt_in: true,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    )

    if (error) throw new Error(error.message)
  } catch (caught) {
    console.error('[starter] failed to persist subscriber', {
      message: caught instanceof Error ? caught.message : 'unknown',
    })
    return NextResponse.json(
      { error: 'We could not save that. Try again in a moment.' },
      { status: 500 },
    )
  }

  // Email failure must not fail the signup — the subscriber row is the record
  // of truth and a retry can resend.
  const result = await sendStarterWelcome({ email: normalisedEmail, ...(name ? { firstName: name } : {}) })
  if (!result.sent && result.reason !== 'resend-not-configured') {
    console.error('[starter] welcome email failed', { reason: result.reason })
  }

  return NextResponse.json({ ok: true })
}
