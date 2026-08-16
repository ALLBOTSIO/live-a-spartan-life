import Link from 'next/link'

import { Container, Heading, Section, SectionLabel } from '@/components/site/section'
import { pillars } from '@/lib/content/pillars'

/**
 * 03 / THE FIVE-PILLAR CODE
 *
 * Desktop: a joined card grid — 1px gaps over the hairline background do the
 * dividing, so there are no card borders to double up.
 * Mobile: the same data as a vertical row stack, every row ≥44px.
 */
export function Pillars() {
  return (
    <Section id="pillars" aria-labelledby="pillars-heading">
      <Container className="py-12 md:py-[110px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-14 md:gap-8">
          <div>
            <SectionLabel className="mb-[18px] md:mb-6">03 / The Five-Pillar Code</SectionLabel>
            <Heading id="pillars-heading" className="m-0 max-w-[640px] text-bone">
              The Code Is Simple. Living It Is the Work.
            </Heading>
          </div>
          <Link
            href="/code"
            className="border-b border-gold pb-1 font-mono text-[12px] tracking-[0.14em] text-gold uppercase transition-colors duration-150 hover:text-bone"
          >
            Read the Full Code {'->'}
          </Link>
        </div>

        <ul className="m-0 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
          {pillars.map((pillar) => (
            <li key={pillar.slug} className="contents">
              <Link
                href={pillar.href}
                className="flex min-h-[44px] items-center gap-4 bg-charcoal p-5 text-bone transition-colors duration-150 hover:bg-charcoal-hover md:min-h-[300px] md:flex-col md:items-stretch md:gap-0 md:px-6 md:pt-8 md:pb-7"
              >
                <span className="w-6 shrink-0 font-mono text-[11px] tracking-[0.12em] text-gold md:mb-10 md:flex md:w-auto md:items-center md:justify-between md:text-[12px]">
                  {pillar.num}
                  <span
                    aria-hidden="true"
                    className="hidden size-2 rotate-45 bg-iron md:inline-block"
                  />
                </span>

                <span className="min-w-0 flex-1 md:flex md:flex-col">
                  <span className="mb-1 block font-display text-[21px] tracking-[0.04em] md:mb-[14px] md:text-[30px]">
                    {pillar.name}
                  </span>
                  <span className="block text-[13px] leading-[1.5] text-steel md:flex-1 md:text-[14px] md:leading-[1.6]">
                    {pillar.def}
                  </span>
                  <span className="mt-6 hidden font-mono text-[10px] tracking-[0.14em] text-iron uppercase md:block">
                    View Pillar {'->'}
                  </span>
                </span>

                <span aria-hidden="true" className="font-mono text-[11px] text-iron md:hidden">
                  {'->'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
