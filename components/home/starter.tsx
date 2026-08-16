import { StarterForm } from '@/components/forms/starter-form'
import { Container, SectionLabel } from '@/components/site/section'

const deliverables = [
  'A simple daily training standard',
  'Food and hydration rules',
  'A mindset reset',
  'One move to strengthen your work and finances',
  'A brotherhood challenge',
]

/**
 * 04 / THE SPARTAN STARTER — the bone section.
 *
 * The value inversion is the point: this is the highest-priority conversion
 * block on the page, and the surface flip is what makes it read that way.
 */
export function Starter() {
  return (
    <section id="starter" className="bg-bone text-carbon" aria-labelledby="starter-heading">
      <Container className="grid items-start gap-10 py-12 md:gap-20 md:py-[110px] lg:grid-cols-2">
        <div>
          <SectionLabel tone="bone-muted" className="mb-[18px] md:mb-6">
            04 / The Spartan Starter
          </SectionLabel>

          <h2
            id="starter-heading"
            className="m-0 mb-[14px] font-display text-[36px] leading-[1.02] text-balance text-carbon md:mb-5 md:text-[56px]"
          >
            Seven Days. One Clear Reset.
          </h2>

          <p className="m-0 mb-6 max-w-[480px] text-[15px] leading-[1.7] text-body-on-bone md:mb-10 md:text-[16px]">
            The Spartan Starter is a practical 7-day reset built around the five pillars. No extreme
            rules. No hype. Just the actions that help you regain momentum.
          </p>

          <ul className="m-0 flex max-w-[480px] list-none flex-col border-t border-bone-hairline p-0">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-bone-hairline py-4"
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-[14px] shrink-0 border-[1.5px] border-red"
                />
                <span className="text-[15px] font-semibold text-charcoal">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-carbon p-7 md:mt-[52px] md:px-11 md:py-12">
          <div className="mb-5 font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
            Free — 7-Day Reset
          </div>
          <p className="m-0 mb-6 font-display text-[28px] tracking-[0.02em] text-bone md:mb-8">
            Get the Starter
          </p>
          <StarterForm source="homepage" inputSurface="charcoal" />
        </div>
      </Container>
    </section>
  )
}
