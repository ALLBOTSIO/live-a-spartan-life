import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { CheckoutButton } from '@/components/brotherhood/checkout-button'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Container, SectionLabel } from '@/components/site/section'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import { pillars } from '@/lib/content/pillars'

export const metadata: Metadata = {
  title: 'Member Area',
  robots: { index: false, follow: false },
}

/** Always rendered per request — it reflects the signed-in man's subscription. */
export const dynamic = 'force-dynamic'

/** Gated member area. Middleware handles the unauthenticated redirect; this
 *  page decides what an authenticated man without an active membership sees. */
export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect('/brotherhood')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, subscription_status, current_period_end')
    .eq('id', user.id)
    .maybeSingle()

  const status = profile?.subscription_status ?? 'none'
  const isMember = status === 'active' || status === 'trialing'
  const firstName = profile?.first_name

  return (
    <Container width="interior" className="py-12 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel tone="gold" className="mb-5">
            The Brotherhood
          </SectionLabel>
          <h1 className="m-0 font-display text-[clamp(36px,6vw,64px)] leading-[1.02]">
            {firstName ? `${firstName}.` : 'Member Area.'}
          </h1>
        </div>
        <SignOutButton />
      </div>

      {isMember ? (
        <>
          <div className="mb-10 border border-hairline bg-charcoal px-6 py-6 md:px-8">
            <p className="m-0 mb-2 font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
              Membership active
            </p>
            <p className="m-0 text-[15px] leading-[1.7] text-steel">
              {profile?.current_period_end
                ? `Next renewal ${new Date(profile.current_period_end).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}.`
                : 'Billed monthly. Cancel any time.'}{' '}
              To change or cancel your subscription, email{' '}
              <a
                href="mailto:hello@liveaspartanlife.com"
                className="border-b border-gold text-bone transition-colors hover:text-gold"
              >
                hello@liveaspartanlife.com
              </a>
              .
            </p>
          </div>

          <SectionLabel className="mb-6">This Week</SectionLabel>
          <p className="m-0 mb-8 max-w-[620px] text-[16px] leading-[1.75] text-steel">
            State one standard you are holding this week, then report against it at the next check.
            That is the whole mechanism. Start with the pillar you are thinnest on.
          </p>

          <ul className="m-0 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
            {pillars.map((pillar) => (
              <li key={pillar.slug} className="contents">
                <Link
                  href={pillar.href}
                  className="flex min-h-[44px] flex-col justify-between gap-3 bg-charcoal px-6 py-6 text-bone transition-colors hover:bg-charcoal-hover"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-gold">
                    {pillar.num}
                  </span>
                  <span className="font-display text-[24px] tracking-[0.04em]">{pillar.name}</span>
                  <span className="text-[13px] leading-[1.5] text-steel">{pillar.def}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="max-w-[620px] border border-hairline bg-charcoal px-6 py-8 md:px-8">
          <p className="m-0 mb-3 font-mono text-[11px] tracking-[0.16em] text-iron uppercase">
            {status === 'past_due' ? 'Payment needs attention' : 'No active membership'}
          </p>
          <h2 className="m-0 mb-4 font-display text-[28px]">Do Not Build Alone.</h2>
          <p className="m-0 mb-7 text-[15px] leading-[1.7] text-steel">
            {status === 'past_due'
              ? 'Your last payment did not go through. Restart the subscription below and access resumes immediately.'
              : 'Your account is set up. Membership is $24 a month, cancel any time.'}
          </p>
          <CheckoutButton label={status === 'past_due' ? 'Restart Membership' : 'Enter the Brotherhood'} />
        </div>
      )}
    </Container>
  )
}
