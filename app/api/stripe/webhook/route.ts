import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { sendBrotherhoodWelcome } from '@/lib/email'
import { env, isStripeConfigured, isSupabaseConfigured, requireEnv } from '@/lib/env'
import { getStripe, mapSubscriptionStatus } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Stripe webhook — the only writer of subscription state.
 *
 * Signature is verified before anything is trusted. The client-side success
 * redirect is cosmetic; membership is granted here and nowhere else.
 *
 * Configure the endpoint in Stripe for:
 *   checkout.session.completed
 *   customer.subscription.created | .updated | .deleted
 */
export async function POST(request: Request) {
  if (!isStripeConfigured || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const payload = await request.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      requireEnv('STRIPE_WEBHOOK_SECRET'),
    )
  } catch (caught) {
    console.error('[stripe-webhook] signature verification failed', {
      message: caught instanceof Error ? caught.message : 'unknown',
    })
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (!isSupabaseConfigured || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[stripe-webhook] Supabase not configured — cannot record membership', {
      type: event.type,
    })
    // 500 so Stripe retries once the database is connected.
    return NextResponse.json({ error: 'Storage unavailable.' }, { status: 500 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.mode !== 'subscription') break

        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id
        const email = session.customer_details?.email ?? session.customer_email ?? null
        const userId = session.client_reference_id ?? session.metadata?.supabase_user_id ?? null

        if (!customerId || !subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const status = mapSubscriptionStatus(subscription.status)
        const periodEnd = currentPeriodEnd(subscription)

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: status,
              current_period_end: periodEnd,
            })
            .eq('id', userId)
        } else if (email) {
          // Guest checkout: match on email so the membership attaches as soon as
          // the man creates his account with the same address.
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: status,
              current_period_end: periodEnd,
            })
            .eq('email', email.toLowerCase())
        }

        if (email) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('stripe_customer_id', customerId)
            .maybeSingle()
          await sendBrotherhoodWelcome({ email, firstName: profile?.first_name ?? null })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id

        const status =
          event.type === 'customer.subscription.deleted'
            ? 'canceled'
            : mapSubscriptionStatus(subscription.status)

        await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: status,
            current_period_end: currentPeriodEnd(subscription),
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break
    }
  } catch (caught) {
    console.error('[stripe-webhook] handler failed', {
      type: event.type,
      message: caught instanceof Error ? caught.message : 'unknown',
    })
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/**
 * `current_period_end` moved onto subscription items in recent API versions.
 * Read whichever the account's version provides rather than assuming one.
 */
function currentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const onSubscription = (subscription as unknown as { current_period_end?: number })
    .current_period_end
  const onItem = subscription.items?.data?.[0]?.current_period_end
  const seconds = onSubscription ?? onItem
  return typeof seconds === 'number' ? new Date(seconds * 1000).toISOString() : null
}
