import 'server-only'

import Stripe from 'stripe'

import { requireEnv } from '@/lib/env'

let stripe: Stripe | null = null

/** Lazily constructed so an unconfigured deploy fails at checkout, not at boot. */
export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      appInfo: { name: 'Live a Spartan Life', url: 'https://liveaspartanlife.com' },
    })
  }
  return stripe
}

/** Stripe's subscription statuses mapped onto the enum in Postgres. */
export function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'canceled':
    case 'paused':
      return 'canceled'
    case 'incomplete':
    case 'incomplete_expired':
      return 'incomplete'
    default:
      return 'none'
  }
}
