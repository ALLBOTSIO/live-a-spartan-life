'use client'

import { useId, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { SrOnlyLabel } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

type Status = 'idle' | 'submitting' | 'sent' | 'error'

/** Supabase Auth magic link. No password storage, no reset flow to maintain. */
export function LoginForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const emailId = useId()
  const next = searchParams.get('next') ?? '/account'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setError('Enter a valid email address.')
      return
    }

    setStatus('submitting')
    setError(null)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (authError) throw new Error(authError.message)
      setStatus('sent')
    } catch (caught) {
      setStatus('error')
      setError(
        caught instanceof Error ? caught.message : 'Could not send the link. Try again shortly.',
      )
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-3">
        <span className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
          Link sent
        </span>
        <p className="m-0 font-display text-[24px] text-bone">Check your email.</p>
        <p className="m-0 font-mono text-[10.5px] leading-[1.6] text-iron">
          The link works once and expires in an hour.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[14px]">
      <SrOnlyLabel htmlFor={emailId}>Email address</SrOnlyLabel>
      <Input
        id={emailId}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        aria-invalid={status === 'error' || undefined}
        className="bg-carbon"
      />
      {error ? (
        <p role="alert" className="m-0 text-[13px] leading-[1.5] text-red">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="min-h-[44px] w-full cursor-pointer border-none bg-red px-6 py-[18px] font-mono text-[13px] tracking-[0.14em] text-bone uppercase transition-colors duration-150 hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Sign-In Link'}
      </button>
    </form>
  )
}
