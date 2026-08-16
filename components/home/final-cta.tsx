import Link from 'next/link'

import { Container } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Closing conversion band. Used as homepage section 08 and repeated at the
 * bottom of the interior pages.
 */
export function FinalCta({
  heading = 'Your Reset Does Not Need to Be Perfect. It Needs to Start.',
  cta = 'Get the Free 7-Day Spartan Starter',
  href = '/start',
  eyebrow,
  surface = 'carbon',
  className,
}: {
  heading?: string
  cta?: string
  href?: string
  eyebrow?: string
  surface?: 'carbon' | 'charcoal'
  className?: string
}) {
  return (
    <section
      className={cn(surface === 'charcoal' ? 'bg-charcoal' : 'bg-carbon', className)}
      aria-labelledby="final-cta-heading"
    >
      <Container className="py-14 text-center md:py-[140px]">
        <h2
          id="final-cta-heading"
          className="mx-auto m-0 mb-8 max-w-[900px] font-display text-[36px] leading-[1.05] text-balance text-bone md:mb-10 md:text-[clamp(44px,5vw,68px)]"
        >
          {heading}
        </h2>
        {eyebrow ? (
          <p className="m-0 mb-8 font-mono text-[12px] tracking-[0.14em] text-iron uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Button asChild size="xl">
          <Link href={href}>{cta}</Link>
        </Button>
      </Container>
    </section>
  )
}
