import type { Metadata } from 'next'

import { CheckoutButton } from '@/components/brotherhood/checkout-button'
import { Container, SectionLabel } from '@/components/site/section'
import { site } from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'The Brotherhood',
  description:
    'A working community for men who want accountability, standards, practical tools, and other men who mean what they say. $24 / month, cancel anytime.',
  alternates: { canonical: '/brotherhood' },
}

const structure = [
  {
    label: 'Weekly',
    title: 'Accountability Check',
    text: 'State your standard, report against it. Simple, direct, no lectures.',
  },
  {
    label: 'Library',
    title: 'Training + Reset Resources',
    text: 'Joint-friendly programs, fuel rules, and the full Starter system.',
  },
  {
    label: 'Rooms',
    title: 'Direct Conversations',
    text: 'Health, work, leadership, and life — talked about like adults.',
  },
  {
    label: 'Standards',
    title: 'Shared Code',
    text: 'Five pillars, held together. Men who expect more from you.',
  },
]

const forYou = [
  'You want accountability, not applause.',
  'You’re rebuilding — health, work, family — and want men beside you.',
  'You can hear the truth without flinching, and say it without cruelty.',
  'You’ll do the work between check-ins.',
]

const notForYou = [
  'You want a highlight reel or a place to perform.',
  'You’re looking for shortcuts, hacks, or magic protocols.',
  'You can’t keep other men’s stories in the room.',
  'You want someone else to do the work for you.',
]

export default function BrotherhoodPage() {
  return (
    <>
      <section className="mx-auto max-w-[820px] px-5 pt-16 pb-12 text-center md:px-8 md:pt-[100px] md:pb-[72px]">
        <SectionLabel tone="gold" className="mb-6 justify-center">
          05 / Brotherhood — Paid Community
        </SectionLabel>

        <h1 className="m-0 mb-6 font-display text-[clamp(44px,8vw,88px)] leading-[0.98] text-balance uppercase">
          Do Not Build Alone.
        </h1>

        <p className="mx-auto m-0 mb-10 max-w-[580px] text-[15px] leading-[1.7] text-steel md:text-[17px]">
          The Brotherhood is a working community for men who want accountability, standards,
          practical tools, and other men who mean what they say.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-7">
          <p className="m-0 font-display text-[30px] md:text-[36px]">
            ${site.brotherhoodPrice}{' '}
            <span className="font-mono text-[11px] tracking-[0.12em] text-iron uppercase md:text-[12px]">
              / Month · Cancel Anytime
            </span>
          </p>
          <CheckoutButton />
        </div>
      </section>

      <section className="border-t border-hairline" aria-labelledby="structure-heading">
        <Container width="interior" className="py-12 md:py-[88px]">
          <SectionLabel id="structure-heading" className="mb-8 md:mb-10">
            What the Work Looks Like
          </SectionLabel>

          <ul className="m-0 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {structure.map((item) => (
              <li key={item.label} className="bg-charcoal px-7 py-8">
                <div className="mb-4 font-mono text-[11px] tracking-[0.14em] text-gold uppercase">
                  {item.label}
                </div>
                <h3 className="m-0 mb-3 font-display text-[22px] tracking-[0.02em]">{item.title}</h3>
                <p className="m-0 text-[14px] leading-[1.6] text-steel">{item.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-hairline">
        <Container
          width="interior"
          className="grid gap-10 py-12 md:gap-12 md:py-[88px] lg:grid-cols-2"
        >
          <div>
            <h2 className="m-0 mb-7 font-display text-[28px] text-bone md:text-[32px]">
              This is for you if…
            </h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {forYou.map((item) => (
                <li key={item} className="flex items-baseline gap-[14px]">
                  <span
                    aria-hidden="true"
                    className="inline-block size-2 shrink-0 rotate-45 bg-gold"
                  />
                  <span className="text-[15px] leading-[1.6] text-steel">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="m-0 mb-7 font-display text-[28px] text-iron md:text-[32px]">
              This is not for you if…
            </h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {notForYou.map((item) => (
                <li key={item} className="flex items-baseline gap-[14px]">
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-0.5 w-2 shrink-0 bg-red"
                  />
                  <span className="text-[15px] leading-[1.6] text-iron">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline bg-charcoal px-5 py-14 text-center md:px-8 md:py-24">
        <h2 className="m-0 mb-4 font-display text-[clamp(30px,5vw,52px)] text-balance">
          A Room Full of Men Building Forward.
        </h2>
        <p className="m-0 mb-8 font-mono text-[11px] tracking-[0.14em] text-iron uppercase md:text-[12px]">
          ${site.brotherhoodPrice} / Month · Weekly Accountability · No Performance, No Posturing
        </p>
        <CheckoutButton />
      </section>
    </>
  )
}
