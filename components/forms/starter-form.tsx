'use client'

import { useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { SrOnlyLabel } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { starterSignupSchema, type SignupSource } from '@/lib/validation'
import { capture } from '@/lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type StarterFormProps = {
  source: SignupSource
  /** Input fill. Charcoal on a carbon card; carbon on a charcoal card. */
  inputSurface?: 'charcoal' | 'carbon'
  className?: string
}

/**
 * Spartan Starter signup — first name (optional) + email (required).
 *
 * Client-side validation, inline error in Spartan Red below the field, and an
 * on-card success state that replaces the form. The button shows "SENDING…"
 * and is disabled in flight.
 */
export function StarterForm({ source, inputSurface = 'charcoal', className }: StarterFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const firstNameId = useId()
  const emailId = useId()
  const errorId = useId()

  const surface = inputSurface === 'carbon' ? 'bg-carbon' : 'bg-charcoal'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = starterSignupSchema.safeParse({
      firstName: String(formData.get('firstName') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
    })

    if (!parsed.success) {
      setStatus('error')
      setError(parsed.error.issues[0]?.message ?? 'Check the form and try again.')
      return
    }

    setStatus('submitting')
    setError(null)

    try {
      const response = await fetch('/api/starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, source }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Something went wrong. Try again in a moment.')
      }

      capture('starter_signup', { source })
      setStatus('success')
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('flex flex-col gap-3', className)} role="status" aria-live="polite">
        <span className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
          You’re in
        </span>
        <p className="m-0 font-display text-[28px] tracking-[0.02em] text-bone">Check your email.</p>
        <p className="m-0 font-mono text-[10.5px] leading-[1.6] text-iron">
          Day 01 is on its way. If it isn’t in your inbox in five minutes, check spam and mark it
          safe so the rest of the week lands.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn('flex flex-col gap-[14px]', className)}>
      <div>
        <SrOnlyLabel htmlFor={firstNameId}>First name (optional)</SrOnlyLabel>
        <Input
          id={firstNameId}
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          className={surface}
        />
      </div>

      <div>
        <SrOnlyLabel htmlFor={emailId}>Email address</SrOnlyLabel>
        <Input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={status === 'error' || undefined}
          aria-describedby={error ? errorId : undefined}
          className={surface}
        />
        {error ? (
          <p id={errorId} role="alert" className="m-0 pt-2 text-[13px] leading-[1.5] text-red">
            {error}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from people, offered to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${emailId}-company`}>Company</label>
        <input id={`${emailId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="min-h-[44px] w-full cursor-pointer border-none bg-red px-6 py-[18px] font-mono text-[13px] tracking-[0.14em] text-bone uppercase transition-colors duration-150 hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending…' : 'Get the Starter'}
      </button>

      <p className="m-0 pt-1 font-mono text-[10.5px] leading-[1.6] text-iron">
        No spam. No fake urgency. Just useful tools for men building a better life.
      </p>
    </form>
  )
}
