import Link from 'next/link'

import { SectionLabel } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/content/site'

const value = [
  'Weekly accountability',
  'Training and reset resources',
  'Direct conversations about health, work, leadership, and life',
  'A room full of men building forward',
]

/** 07 / THE BROTHERHOOD */
export function BrotherhoodBand() {
  return (
    <section
      id="brotherhood"
      className="border-b border-hairline bg-charcoal"
      aria-labelledby="brotherhood-heading"
    >
      <div className="mx-auto max-w-[900px] px-5 py-14 text-center md:px-8 md:py-[120px]">
        <SectionLabel tone="gold" className="mb-[18px] justify-center md:mb-7">
          07 / The Brotherhood
        </SectionLabel>

        <h2
          id="brotherhood-heading"
          className="m-0 mb-4 font-display text-[44px] leading-none text-balance text-bone md:mb-6 md:text-[72px]"
        >
          Do Not Build Alone.
        </h2>

        <p className="mx-auto m-0 mb-8 max-w-[600px] text-[15px] leading-[1.7] text-steel md:mb-14 md:text-[17px]">
          The Brotherhood is a working community for men who want accountability, standards,
          practical tools, and other men who mean what they say.
        </p>

        <ul className="m-0 mb-8 grid list-none gap-px border border-hairline bg-hairline p-0 text-left md:mb-14 md:[grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
          {value.map((item) => (
            <li key={item} className="flex items-center gap-[18px] bg-carbon px-6 py-6 md:px-8 md:py-7">
              <span aria-hidden="true" className="inline-block size-2 shrink-0 rotate-45 bg-red" />
              <span className="text-[15px] font-semibold text-bone">{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <p className="m-0 font-display text-[30px] text-bone md:text-[40px]">
            ${site.brotherhoodPrice}{' '}
            <span className="font-mono text-[11px] tracking-[0.12em] text-iron uppercase md:text-[13px]">
              / Month
            </span>
          </p>
          <Button asChild size="lg" className="px-9 py-5">
            <Link href="/brotherhood">Enter the Brotherhood</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
