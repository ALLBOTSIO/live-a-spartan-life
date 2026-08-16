import Link from 'next/link'

import { FigureCaption, ImageSlot } from '@/components/site/image-slot'
import { Container, SectionLabel } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/content/site'

/**
 * 01 / HERO — treatment 1a, split editorial (type left, image right).
 * 1b full-bleed and 1c field-manual index remain in the design bundle as
 * alternates; swapping is a change to this component only.
 *
 * Mobile stacks type -> image -> CTAs, matching the 390px design. See
 * `.hero-grid` in globals.css for how that reflows on desktop.
 */
export function Hero() {
  return (
    <section className="border-b border-hairline" aria-labelledby="hero-heading">
      <Container className="hero-grid py-12 lg:min-h-[88vh] lg:py-20">
        <div className="hero-top">
          <SectionLabel tone="gold" rule className="mb-6 lg:mb-7">
            01 / Start Here
          </SectionLabel>

          <h1
            id="hero-heading"
            className="m-0 mb-[18px] font-display text-[52px] leading-[0.95] tracking-[0.01em] text-balance text-bone uppercase lg:mb-7 lg:text-[clamp(64px,8vw,110px)]"
          >
            Live a Spartan Life
          </h1>

          <p className="m-0 mb-[14px] font-display text-[17px] tracking-[0.03em] text-red uppercase lg:mb-5 lg:text-[24px]">
            {site.tagline}
          </p>

          <p className="m-0 mb-6 max-w-[520px] text-[15px] leading-[1.65] text-steel lg:mb-0 lg:text-[17px]">
            {site.description}
          </p>
        </div>

        <div className="hero-image relative mb-6 h-[300px] lg:mb-0 lg:h-[72vh] lg:min-h-[480px]">
          <ImageSlot
            id="hero-jroc"
            brief="JROC training scene — hard directional light, desaturated, cinematic"
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <FigureCaption>Fig. 01 — The Standard</FigureCaption>
        </div>

        <div className="hero-bottom">
          <div className="mb-5 flex flex-col gap-3 lg:mt-9 lg:mb-8 lg:flex-row lg:flex-wrap lg:gap-4">
            <Button asChild size="lg">
              <Link href="/start">Get the Free 7-Day Spartan Starter</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/code">Read the Code</Link>
            </Button>
          </div>

          <p className="m-0 max-w-[480px] font-mono text-[10.5px] leading-[1.6] text-iron lg:text-[11.5px]">
            Built by Jason “JROC” Craig — veteran, father, builder, and proof that a hard reset can
            become a better life.
          </p>
        </div>
      </Container>
    </section>
  )
}
