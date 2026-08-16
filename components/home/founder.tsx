import Link from 'next/link'

import { FigureCaption, ImageSlot } from '@/components/site/image-slot'
import { Container, Section, SectionLabel } from '@/components/site/section'
import { Button } from '@/components/ui/button'

const story = [
  { n: 'I.', label: 'Service', text: 'a veteran who learned standards the hard way, in uniform.' },
  { n: 'II.', label: 'Chaos', text: 'hard seasons — health decline, burnout, and losing the thread.' },
  {
    n: 'III.',
    label: 'Rebuild',
    text: 'training, whole food, honest work, and men who held the line.',
  },
  { n: 'IV.', label: 'Now', text: 'mid-40s and stronger, steadier, and more capable than at 30.' },
]

/** 05 / THE FOUNDER */
export function Founder() {
  return (
    <Section id="founder" aria-labelledby="founder-heading">
      <Container className="grid items-center gap-10 py-12 md:gap-20 md:py-[110px] lg:grid-cols-2">
        <div className="relative h-[320px] md:h-[560px]">
          <ImageSlot
            id="founder-portrait"
            brief="JROC documentary portrait, natural light"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <FigureCaption>Fig. 02 — The Founder</FigureCaption>
        </div>

        <div>
          <SectionLabel className="mb-[18px] md:mb-6">05 / The Founder</SectionLabel>

          <h2
            id="founder-heading"
            className="m-0 mb-6 font-display text-[32px] leading-[1.05] text-balance text-bone md:mb-8 md:text-[48px]"
          >
            I Did Not Build This From Perfect Conditions.
          </h2>

          <ol className="m-0 mb-8 flex max-w-[540px] list-none flex-col gap-[18px] p-0 md:mb-9">
            {story.map((beat) => (
              <li key={beat.n} className="flex items-baseline gap-[18px]">
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 font-mono text-[11px] tracking-[0.12em] text-gold"
                >
                  {beat.n}
                </span>
                <p className="m-0 text-[15px] leading-[1.65] text-steel">
                  <strong className="font-bold text-bone">{beat.label}</strong> — {beat.text}
                </p>
              </li>
            ))}
          </ol>

          <blockquote className="m-0 mb-8 max-w-[520px] border-l-2 border-gold py-1 pl-6 text-[17px] leading-[1.55] font-medium text-bone md:mb-9 md:text-[19px]">
            “The goal is not to look tough online. The goal is to become the kind of man your family,
            team, and future can rely on.”
          </blockquote>

          <Button asChild variant="outline" size="md" className="px-[26px] py-4 text-[12px]">
            <Link href="/about">Meet JROC</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
