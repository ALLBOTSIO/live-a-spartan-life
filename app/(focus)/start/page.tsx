import type { Metadata } from 'next'

import { StarterForm } from '@/components/forms/starter-form'
import { FinalCta } from '@/components/home/final-cta'
import { Container, SectionLabel } from '@/components/site/section'

export const metadata: Metadata = {
  title: 'Seven Days. One Clear Reset.',
  description:
    'The Spartan Starter is a free, practical 7-day reset built around the five pillars. No extreme rules. No hype. Just the actions that help you regain momentum.',
  alternates: { canonical: '/start' },
}

const days = [
  {
    n: '01',
    name: 'Stand Up',
    text: 'A simple daily training standard — movement you can repeat, whatever shape you’re in.',
  },
  {
    n: '02',
    name: 'Fuel Rules',
    text: 'Food and hydration rules: protein-forward, whole food, water before caffeine.',
  },
  {
    n: '03',
    name: 'Clear the Noise',
    text: 'A mindset reset — one honest inventory of where the drift started.',
  },
  { n: '04', name: 'Train Again', text: 'The training standard, repeated. Consistency over intensity.' },
  {
    n: '05',
    name: 'Provide Move',
    text: 'One move to strengthen your work and finances — the weekly money review.',
  },
  {
    n: '06',
    name: 'Reach Out',
    text: 'The brotherhood challenge: one real conversation with a man you respect.',
  },
  {
    n: '07',
    name: 'Set the Standard',
    text: 'Lock the week’s wins into a standard you keep — and decide what comes next.',
  },
]

export default function StartPage() {
  return (
    <>
      <section className="mx-auto max-w-[780px] px-5 pt-16 pb-12 text-center md:px-8 md:pt-24 md:pb-16">
        <SectionLabel tone="gold" className="mb-6 justify-center">
          Free — 7-Day Reset
        </SectionLabel>

        <h1 className="m-0 mb-6 font-display text-[clamp(40px,7vw,76px)] leading-none text-balance uppercase">
          Seven Days. One Clear Reset.
        </h1>

        <p className="mx-auto m-0 mb-10 max-w-[560px] text-[15px] leading-[1.7] text-steel md:text-[17px]">
          The Spartan Starter is a practical 7-day reset built around the five pillars. No extreme
          rules. No hype. Just the actions that help you regain momentum.
        </p>

        <div
          id="starter-form"
          className="mx-auto max-w-[520px] border border-hairline bg-charcoal p-6 text-left md:p-9"
        >
          <StarterForm source="start-page" inputSurface="carbon" />
        </div>
      </section>

      <section className="border-t border-hairline" aria-labelledby="structure-heading">
        <Container width="interior" className="py-12 md:py-[88px]">
          <SectionLabel className="mb-5">The Structure</SectionLabel>
          <h2 id="structure-heading" className="m-0 mb-8 font-display text-[28px] md:mb-10 md:text-[40px]">
            What the Seven Days Look Like
          </h2>

          <ol className="m-0 flex list-none flex-col gap-px border border-hairline bg-hairline p-0">
            {days.map((day) => (
              <li
                key={day.n}
                className="grid gap-2 bg-charcoal px-5 py-5 md:grid-cols-[90px_200px_1fr] md:items-baseline md:gap-6 md:px-7 md:py-[22px]"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-gold uppercase">
                  Day {day.n}
                </span>
                <span className="font-display text-[20px] tracking-[0.03em] uppercase md:text-[22px]">
                  {day.name}
                </span>
                <span className="text-[14px] leading-[1.6] text-steel">{day.text}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-hairline" aria-labelledby="proof-heading">
        <Container width="interior" className="py-12 md:py-[72px]">
          <SectionLabel id="proof-heading" className="mb-8">
            From Men Running the Reset
          </SectionLabel>
          {/* Reserved, not empty by accident: real member quotes replace these once
              the client has verified stories and written permission to publish. */}
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="flex min-h-[160px] flex-col justify-center gap-[10px] border border-dashed border-input-border px-7 py-8"
              >
                <span className="font-mono text-[10px] tracking-[0.16em] text-iron uppercase">
                  Testimonial — Reserved
                </span>
                <span className="text-[13px] leading-[1.6] text-iron">
                  Space reserved for a verified member story — name, age, and what changed.
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCta href="#starter-form" className="border-t border-hairline" />
    </>
  )
}
