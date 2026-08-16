import type { Metadata } from 'next'

import { LegalDocument } from '@/components/site/legal-document'
import { site } from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of Live a Spartan Life and Brotherhood membership.',
  alternates: { canonical: '/terms' },
}

/**
 * DRAFT — requires review by counsel before launch.
 *
 * Governing law, the company's legal entity name, and the refund position are
 * placeholders in the sense that they must be confirmed by JROC and counsel,
 * not invented here. Do not publish without that review.
 */
export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" updated="August 2026">
      <h2>Agreement</h2>
      <p>
        By using {site.name} you agree to these terms. If you do not agree, do not use the site.
      </p>

      <h2>What this is</h2>
      <p>
        {site.name} publishes written material, a free 7-day reset, and a paid membership community.
        It is education and general information — not medical, psychological, legal, or financial
        advice, and no professional relationship is created by using it.
      </p>

      <h2>Health and safety</h2>
      <p>
        Training, nutrition, and lifestyle content here is general in nature. You are responsible for
        deciding whether it is appropriate for you. Talk to a qualified professional before starting
        or changing a training or nutrition programme, particularly if you have an existing
        condition, an injury, or are taking medication. Stop and seek care if something hurts in a
        way that is not normal training discomfort.
      </p>

      <h2>Brotherhood membership</h2>
      <ul>
        <li>
          Membership is ${site.brotherhoodPrice} per month, billed monthly through Stripe until you
          cancel.
        </li>
        <li>
          You can cancel at any time. Cancellation ends future billing and your access continues
          through the end of the period you have already paid for.
        </li>
        <li>
          Membership is personal to you. Do not share access, and do not republish material from the
          member area.
        </li>
        <li>
          What is said between members stays between members. Breaching that confidence, harassing
          another member, or using the community to sell to it are grounds for removal without
          refund.
        </li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed by Stripe. Prices are in US dollars and exclude any taxes that apply
        where you live. If a payment fails, access may be suspended until it is resolved.
      </p>

      <h2>Content and ownership</h2>
      <p>
        The writing, design, and materials on this site belong to {site.name} unless stated
        otherwise. You may read, share links to, and quote short excerpts with attribution. You may
        not republish material wholesale, resell it, or use it to train a commercial model without
        written permission.
      </p>

      <h2>Anything you post</h2>
      <p>
        You keep ownership of what you write in the community. By posting it you give us permission
        to display it inside the community for the purpose of running it. Do not post anything you
        do not have the right to share.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some outbound links, including on the Gear page, may earn a commission. That never decides
        what gets recommended, and it is disclosed on the page where it applies.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site and community running but do not guarantee uninterrupted access.
        Features may change as the platform develops.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} is not liable for indirect or consequential loss
        arising from use of the site or the community, and total liability is limited to the amount
        you paid in the twelve months before the claim.
      </p>

      <h2>Ending access</h2>
      <p>
        We may suspend or end access for conduct that breaks these terms. You can stop using the site
        or cancel your membership at any time.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Material changes will be dated above and, where they affect
        members, communicated by email before they take effect.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@liveaspartanlife.com">hello@liveaspartanlife.com</a>
      </p>
    </LegalDocument>
  )
}
