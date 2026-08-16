import type { Metadata } from 'next'

import { FinalCta } from '@/components/home/final-cta'
import { FigureCaption, ImageSlot } from '@/components/site/image-slot'
import { Container, SectionLabel } from '@/components/site/section'

export const metadata: Metadata = {
  title: 'About — Jason “JROC” Craig',
  description:
    'Veteran. Father. Builder. Live a Spartan Life is not a highlight reel — it is a record of a rebuild, kept honest so other men can use it.',
  alternates: { canonical: '/about' },
}

const chapters = [
  {
    tag: 'I.',
    title: 'Service',
    text: 'The military gave him standards, load-bearing habits, and men he’d answer to. It also set a bar that civilian life quietly eroded.',
  },
  {
    tag: 'II.',
    title: 'Chaos',
    text: 'Hard seasons don’t announce themselves. Health slid, weight climbed, work consumed, connection thinned. The drift was slow enough to deny — until it wasn’t.',
  },
  {
    tag: 'III.',
    title: 'Rebuild',
    text: 'No transformation montage. Training that respected his joints. Whole food. A weekly money review. Honest conversations with men who held the line. Repeated, imperfectly, for years.',
  },
  {
    tag: 'IV.',
    title: 'Now',
    text: 'Mid-40s — stronger, steadier, and more useful than at 30. Live a Spartan Life is the system he wishes he’d had at the bottom, written down for the next man.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section>
        <Container
          width="interior"
          className="grid items-center gap-10 py-12 md:gap-16 md:pt-[88px] md:pb-16 lg:grid-cols-2"
        >
          <div>
            <SectionLabel tone="gold" className="mb-6">
              The Founder
            </SectionLabel>
            <h1 className="m-0 mb-6 font-display text-[clamp(36px,6vw,64px)] leading-[1.02] text-balance">
              I Did Not Build This From Perfect Conditions.
            </h1>
            <p className="m-0 text-[15px] leading-[1.7] text-steel md:text-[16px]">
              Jason “JROC” Craig. Veteran. Father. Builder. Mid-40s. This isn’t a highlight reel —
              it’s a record of a rebuild, kept honest so other men can use it.
            </p>
          </div>

          <div className="relative h-[320px] md:h-[480px]">
            <ImageSlot
              id="about-portrait"
              brief="JROC documentary portrait, natural light"
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <FigureCaption>Fig. 01 — Not a Guru</FigureCaption>
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline" aria-labelledby="record-heading">
        <Container width="manifesto" className="py-12 md:py-[88px]">
          <SectionLabel id="record-heading" className="mb-10 md:mb-12">
            The Record
          </SectionLabel>

          <ol className="m-0 flex list-none flex-col p-0">
            {chapters.map((chapter) => (
              <li
                key={chapter.tag}
                className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[80px_1fr] md:gap-8 md:py-9"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[12px] tracking-[0.14em] text-gold"
                >
                  {chapter.tag}
                </span>
                <div>
                  <h2 className="m-0 mb-[14px] font-display text-[26px] tracking-[0.02em] uppercase md:text-[30px]">
                    {chapter.title}
                  </h2>
                  <p className="m-0 text-[15px] leading-[1.75] text-steel">{chapter.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <blockquote className="m-0 mt-12 max-w-[620px] border-l-2 border-gold py-2 pl-7 text-[19px] leading-[1.55] font-medium md:mt-14 md:text-[22px]">
            “The goal is not to look tough online. The goal is to become the kind of man your family,
            team, and future can rely on.”
          </blockquote>
        </Container>
      </section>

      <FinalCta
        heading="The Rebuild Is Repeatable. Start Yours."
        surface="charcoal"
        className="border-t border-hairline"
      />
    </>
  )
}
