import type { Metadata } from 'next'
import Link from 'next/link'

import { FinalCta } from '@/components/home/final-cta'
import { Container, SectionLabel } from '@/components/site/section'
import { pillars } from '@/lib/content/pillars'

export const metadata: Metadata = {
  title: 'The Code',
  description:
    'Five pillars: Train, Fuel, Mind, Provide, Brotherhood. A few clear commitments you keep whether you feel like it or not.',
  alternates: { canonical: '/code' },
}

/**
 * The manifesto. Not in the design bundle — built on the established system at
 * the 820px manifesto width the handoff specifies for this route.
 */
export default function CodePage() {
  return (
    <>
      <section className="border-b border-hairline">
        <Container width="manifesto" className="py-12 md:py-24">
          <SectionLabel tone="gold" rule className="mb-6">
            The Code
          </SectionLabel>

          <h1 className="m-0 mb-6 font-display text-[clamp(44px,8vw,88px)] leading-[0.98] text-balance">
            The Code Is Simple. Living It Is the Work.
          </h1>

          <p className="m-0 mb-6 max-w-[620px] text-[16px] leading-[1.75] text-steel md:text-[17px]">
            You do not need more motivation. Motivation is weather. A code is a standard you keep
            whether you feel like it or not — five commitments, small enough to hold in your head,
            heavy enough to change the shape of a life.
          </p>

          <p className="m-0 max-w-[620px] text-[16px] leading-[1.75] text-steel md:text-[17px]">
            None of this is complicated. All of it is difficult. That is the point.
          </p>
        </Container>
      </section>

      <section className="border-b border-hairline">
        <Container width="manifesto" className="py-12 md:py-[88px]">
          <ol className="m-0 flex list-none flex-col p-0">
            {pillars.map((pillar) => (
              <li key={pillar.slug} className="border-t border-hairline py-9 md:py-12">
                <div className="mb-4 flex items-center gap-4">
                  <span className="font-mono text-[12px] tracking-[0.14em] text-gold">
                    {pillar.num}
                  </span>
                  <span aria-hidden="true" className="h-px w-8 bg-gold" />
                </div>

                <h2 className="m-0 mb-4 font-display text-[36px] tracking-[0.03em] md:text-[48px]">
                  <Link href={pillar.href} className="transition-colors hover:text-gold">
                    {pillar.name}
                  </Link>
                </h2>

                <p className="m-0 mb-4 font-display text-[17px] tracking-[0.03em] text-red uppercase md:text-[20px]">
                  {pillar.def}
                </p>

                <p className="m-0 mb-6 max-w-[620px] text-[15px] leading-[1.75] text-steel md:text-[16px]">
                  {pillar.intro}
                </p>

                <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
                  {pillar.standards.map((standard) => (
                    <li key={standard.label} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-[9px] inline-block size-2 shrink-0 rotate-45 bg-gold"
                      />
                      <p className="m-0 text-[15px] leading-[1.7] text-steel">
                        <strong className="font-bold text-bone">{standard.label}</strong> —{' '}
                        {standard.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pillar.href}
                  className="border-b border-gold pb-1 font-mono text-[11px] tracking-[0.14em] text-gold uppercase transition-colors hover:text-bone"
                >
                  {pillar.slug === 'brotherhood' ? 'Enter the Brotherhood' : 'View Pillar'} {'->'}
                </Link>
              </li>
            ))}
          </ol>

          <blockquote className="m-0 mt-12 border-l-2 border-gold py-2 pl-7 text-[19px] leading-[1.55] font-medium md:text-[22px]">
            “The goal is not to look tough online. The goal is to become the kind of man your family,
            team, and future can rely on.”
          </blockquote>
        </Container>
      </section>

      <FinalCta />
    </>
  )
}
