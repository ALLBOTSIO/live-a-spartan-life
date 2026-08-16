'use client'

import { useState } from 'react'

import { capture } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Starts a Stripe Checkout session for the $24/mo Brotherhood subscription.
 *
 * The route handler owns the price — the client never sends an amount, so a
 * tampered request cannot buy the membership for a dollar.
 */
export function CheckoutButton({
  label = 'Enter the Brotherhood',
  className,
}: {
  label?: string
  className?: string
}) {
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setStatus('redirecting')
    setError(null)
    capture('brotherhood_checkout_started')

    try {
      const response = await fetch('/api/checkout', { method: 'POST' })
      const body = (await response.json().catch(() => null)) as {
        url?: string
        error?: string
      } | null

      if (!response.ok || !body?.url) {
        throw new Error(body?.error ?? 'Checkout is unavailable right now. Try again shortly.')
      }

      window.location.assign(body.url)
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'Checkout failed. Try again.')
    }
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-3', className)}>
      <button
        type="button"
        onClick={startCheckout}
        disabled={status === 'redirecting'}
        className="min-h-[44px] cursor-pointer border-none bg-red px-8 py-5 font-mono text-[13px] tracking-[0.14em] text-bone uppercase transition-colors duration-150 hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'redirecting' ? 'Opening checkout…' : label}
      </button>
      {error ? (
        <p role="alert" className="m-0 max-w-[360px] text-[13px] leading-[1.5] text-red">
          {error}
        </p>
      ) : null}
    </div>
  )
}
