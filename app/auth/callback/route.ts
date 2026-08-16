import { NextResponse } from 'next/server'

import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

/** Exchanges the magic-link code for a session, then forwards to `next`. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'
  // Only same-site paths — never forward to an attacker-supplied absolute URL.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/account'

  if (!code || !isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/login?error=link`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth-callback] exchange failed', { message: error.message })
    return NextResponse.redirect(`${origin}/login?error=expired`)
  }

  return NextResponse.redirect(`${origin}${safeNext}`)
}
