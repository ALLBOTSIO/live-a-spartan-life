import { NextResponse } from 'next/server'

import { env, isStripeConfigured } from '@/lib/env'
import { clientKey, rateLimit } from '@/lib/rate-limit'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

/**
 * Creates a Stripe Checkout session for the $24/mo Brotherhood subscription.
 *
 * The price comes from STRIPE_BROTHERHOOD_PRICE_ID on the server — the client
 * never sends an amount. Signed-in users are attached to their existing Stripe
 * customer so the webhook can match the subscription back to a profile.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'checkout'))
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many attempts. Give it a minute.' }, { status: 429 })
  }

  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: 'Checkout is not connected yet. Email hello@liveaspartanlife.com to join.' },
      { status: 503 },
    )
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

  let userId: string | undefined
  let userEmail: string | undefined
  let stripeCustomerId: string | undefined

  // Signing in is optional at checkout — the webhook creates the link either way.
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      userId = user.id
      userEmail = user.email ?? undefined
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .maybeSingle()
      stripeCustomerId = profile?.stripe_customer_id ?? undefined
    }
  } catch {
    // Supabase unavailable — proceed as a guest checkout.
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: env.STRIPE_BROTHERHOOD_PRICE_ID!, quantity: 1 }],
      success_url: `${siteUrl}/account?checkout=success`,
      cancel_url: `${siteUrl}/brotherhood?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: false },
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : userEmail
          ? { customer_email: userEmail }
          : {}),
      client_reference_id: userId,
      subscription_data: {
        metadata: { product: 'brotherhood', ...(userId ? { supabase_user_id: userId } : {}) },
      },
      metadata: { product: 'brotherhood', ...(userId ? { supabase_user_id: userId } : {}) },
    })

    if (!session.url) throw new Error('Stripe returned no checkout URL')

    return NextResponse.json({ url: session.url })
  } catch (caught) {
    console.error('[checkout] failed to create session', {
      message: caught instanceof Error ? caught.message : 'unknown',
    })
    return NextResponse.json(
      { error: 'Checkout is unavailable right now. Try again shortly.' },
      { status: 500 },
    )
  }
}
