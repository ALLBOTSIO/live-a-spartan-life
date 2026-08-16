'use client'

import { useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { SrOnlyLabel } from '@/components/ui/label'
import { newsletterSignupSchema, type SignupSource } from '@/lib/validation'
import { capture } from '@/lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/** Field Notes newsletter — email only. Same states as the Starter form. */
export function NewsletterForm({ source = 'field-notes' }: { source?: SignupSource }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const emailId = useId()
  const errorId = useId()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = newsletterSignupSchema.safeParse({
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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, source }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Something went wrong. Try again in a moment.')
      }
      capture('newsletter_signup', { source })
      setStatus('success')
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="m-0 border border-hairline bg-carbon px-6 py-5 font-mono text-[11px] tracking-[0.16em] text-gold uppercase"
      >
        Subscribed — check your email.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-[460px]">
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
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
            className="bg-carbon"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="min-h-[44px] cursor-pointer border-none bg-red px-6 py-4 font-mono text-[12px] tracking-[0.14em] text-bone uppercase transition-colors duration-150 hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? 'Sending…' : 'Subscribe'}
        </button>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${emailId}-company`}>Company</label>
        <input id={`${emailId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="m-0 pt-3 text-left text-[13px] text-red">
          {error}
        </p>
      ) : null}
    </form>
  )
}
