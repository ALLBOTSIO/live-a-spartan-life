import type { Metadata } from 'next'

import { FinalCta } from '@/components/home/final-cta'
import { Container, SectionLabel } from '@/components/site/section'

export const metadata: Metadata = {
  title: 'Gear',
  description:
    'The short list of equipment actually used in the five pillars. Plain-language affiliate disclosure, no gear worship.',
  alternates: { canonical: '/gear' },
}

/**
 * Gear.
 *
 * No products are listed yet — inventing recommendations or affiliate
 * relationships would be a false claim, so each category ships as a reserved
 * slot until JROC supplies the list. The disclosure block sits above the
 * listings by design and must stay there.
 */
const categories = [
  {
    label: 'Ruck',
    text: 'Pack, plate, and socks. The gear that makes the most-used tool in the code sustainable.',
  },
  {
    label: 'Train',
    text: 'The short list for a garage setup that survives a decade: bells, a bar, and something to hang from.',
  },
  {
    label: 'Fuel',
    text: 'Kitchen equipment that makes protein-first the easy option instead of the disciplined one.',
  },
  {
    label: 'Recover',
    text: 'Sleep, light, and the unglamorous items that make the training count.',
  },
]

export default function GearPage() {
  return (
    <>
      <section className="border-b border-hairline">
        <Container width="interior" className="py-12 md:py-20">
          <SectionLabel tone="gold" rule className="mb-6">
            Gear
          </SectionLabel>
          <h1 className="m-0 mb-6 font-display text-[clamp(40px,7vw,76px)] leading-[0.98] text-balance">
            Buy Less. Use It Harder.
          </h1>
          <p className="m-0 max-w-[620px] text-[15px] leading-[1.7] text-steel md:text-[17px]">
            Gear does not build anything. A short list of equipment that holds up under real use
            removes friction — that is the entire job. Everything here has to earn its place in one
            of the five pillars or it does not go on the list.
          </p>
        </Container>
      </section>

      {/* Disclosure sits above the listings. Plain language, no fine print. */}
      <section className="border-b border-hairline bg-charcoal">
        <Container width="interior" className="py-8 md:py-10">
          <p className="m-0 mb-2 font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
            Affiliate Disclosure
          </p>
          <p className="m-0 max-w-[720px] text-[15px] leading-[1.7] text-steel">
            Some links on this page may earn a commission if you buy through them, at no extra cost
            to you. That commission never decides what goes on the list. Nothing here is
            recommended because it pays, and anything that stops working gets removed.
          </p>
        </Container>
      </section>

      <section className="border-b border-hairline" aria-labelledby="gear-list">
        <Container width="interior" className="py-12 md:py-[88px]">
          <SectionLabel id="gear-list" className="mb-8">
            The List
          </SectionLabel>

          <ul className="m-0 grid list-none gap-6 p-0 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {categories.map((category) => (
              <li
                key={category.label}
                className="flex min-h-[200px] flex-col gap-3 border border-dashed border-input-border px-7 py-8"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
                  {category.label}
                </span>
                <p className="m-0 text-[14px] leading-[1.6] text-steel">{category.text}</p>
                <span className="mt-auto font-mono text-[10px] tracking-[0.16em] text-iron uppercase">
                  List in progress
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 m-0 max-w-[620px] text-[15px] leading-[1.7] text-iron">
            The gear list is being written the same way everything else here is — only after it has
            been used long enough to have an honest opinion about it. Get the Starter and it will
            reach you when it is ready.
          </p>
        </Container>
      </section>

      <FinalCta />
    </>
  )
}
