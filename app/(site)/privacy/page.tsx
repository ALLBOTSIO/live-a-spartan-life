import type { Metadata } from 'next'

import { LegalDocument } from '@/components/site/legal-document'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What Live a Spartan Life collects, why, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

/**
 * DRAFT — requires review by counsel before launch.
 *
 * Written to match what the site actually does today: Supabase (accounts and
 * subscriber records), Stripe (payments), Resend (email), PostHog (analytics),
 * Vercel (hosting). If an integration is added or removed, this page changes
 * with it. Jurisdiction-specific obligations (GDPR/UK GDPR, CCPA/CPRA) depend
 * on where the audience actually is — confirm with counsel.
 */
export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated="August 2026">
      <h2>The short version</h2>
      <p>
        We collect the minimum needed to send you what you asked for and to keep the site working.
        We do not sell your information. You can have your data deleted by asking.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Email address and first name</strong> — when you request the Spartan Starter or
          subscribe to Field Notes. First name is optional.
        </li>
        <li>
          <strong>Account details</strong> — if you join the Brotherhood: your email address and
          subscription status.
        </li>
        <li>
          <strong>Payment information</strong> — handled entirely by Stripe. We never see or store
          your card number.
        </li>
        <li>
          <strong>Usage data</strong> — pages visited, approximate location derived from IP address,
          device and browser type, collected through PostHog analytics.
        </li>
      </ul>

      <h2>Why we collect it</h2>
      <ul>
        <li>To deliver the Spartan Starter and the Field Notes newsletter you asked for.</li>
        <li>To provide and bill for Brotherhood membership.</li>
        <li>To understand which pages are useful so the site gets better rather than bigger.</li>
        <li>To meet legal and accounting obligations.</li>
      </ul>

      <h2>Who processes it</h2>
      <p>
        We use a small number of established providers, each handling only what their function
        requires: <strong>Supabase</strong> (accounts and subscriber records),{' '}
        <strong>Stripe</strong> (payments and subscription management),{' '}
        <strong>Resend</strong> (transactional and newsletter email),{' '}
        <strong>PostHog</strong> (product analytics), and <strong>Vercel</strong> (hosting). Each
        holds data under its own privacy terms and processes it on our instruction.
      </p>

      <h2>Email</h2>
      <p>
        Every email we send carries a one-click unsubscribe link. Unsubscribing from the newsletter
        does not cancel a Brotherhood membership, and cancelling a membership does not automatically
        unsubscribe you from the newsletter — the two are separate on purpose.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We use cookies for sign-in sessions and for analytics. Analytics is configured to record
        behaviour rather than build advertising profiles, and we do not run advertising trackers or
        sell audience data to anyone.
      </p>

      <h2>Retention</h2>
      <p>
        Subscriber records are kept until you unsubscribe or ask for deletion. Billing records are
        kept as long as tax and accounting rules require. Analytics data is retained on a rolling
        basis and is not tied to a named person unless you have an account.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to show you what we hold, correct it, export it, or delete it. Depending on
        where you live you may have specific statutory rights — we apply the same process to
        everyone regardless. Email{' '}
        <a href="mailto:privacy@liveaspartanlife.com">privacy@liveaspartanlife.com</a> and we will
        respond within 30 days.
      </p>

      <h2>Children</h2>
      <p>
        This site is built for adult men and is not directed at anyone under 18. We do not knowingly
        collect information from children.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, we will update the date above and, where the change
        affects how we use your information, tell subscribers by email.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:privacy@liveaspartanlife.com">privacy@liveaspartanlife.com</a>
      </p>
    </LegalDocument>
  )
}
