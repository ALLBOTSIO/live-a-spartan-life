import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/field-notes/article-card'
import { FinalCta } from '@/components/home/final-cta'
import { Container, SectionLabel } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { getArticles, toCardData } from '@/lib/content/articles'
import { pillarBySlug, pillarRoutes, pillars } from '@/lib/content/pillars'

/**
 * Pillar detail pages — /train, /fuel, /mind, /provide.
 *
 * These were not in the design bundle ("Still to design" in the handoff), so
 * they follow the established system: mono index label, Anton headline, joined
 * standards grid, then the pillar's field notes. Brotherhood has its own sales
 * page and is excluded here.
 *
 * `dynamicParams = false` keeps this dynamic segment from swallowing unknown
 * top-level URLs — anything not in the list 404s.
 */
export const dynamicParams = false

type PageProps = { params: Promise<{ pillar: string }> }

export function generateStaticParams() {
  return pillarRoutes.map((pillar) => ({ pillar: pillar.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar: slug } = await params
  const pillar = pillarBySlug(slug)
  if (!pillar) return { title: 'Not found' }

  return {
    title: `${pillar.name[0]}${pillar.name.slice(1).toLowerCase()} — Pillar ${pillar.num}`,
    description: `${pillar.def} ${pillar.intro}`,
    alternates: { canonical: pillar.href },
  }
}

export default async function PillarPage({ params }: PageProps) {
  const { pillar: slug } = await params
  const pillar = pillarBySlug(slug)
  if (!pillar || pillar.slug === 'brotherhood') notFound()

  const articles = await getArticles()
  const related = articles
    .filter((article) => article.category === pillar.category)
    .slice(0, 3)
    .map(toCardData)

  const others = pillars.filter((item) => item.slug !== pillar.slug)

  return (
    <>
      <section className="border-b border-hairline">
        <Container width="interior" className="py-12 md:py-20">
          <SectionLabel tone="gold" rule className="mb-6">
            {pillar.num} / The Code
          </SectionLabel>

          <h1 className="m-0 mb-6 font-display text-[clamp(52px,9vw,110px)] leading-[0.95] tracking-[0.01em]">
            {pillar.name}
          </h1>

          <p className="m-0 mb-5 max-w-[620px] font-display text-[17px] tracking-[0.03em] text-red uppercase md:text-[24px]">
            {pillar.def}
          </p>

          <p className="m-0 max-w-[620px] text-[15px] leading-[1.7] text-steel md:text-[17px]">
            {pillar.intro}
          </p>
        </Container>
      </section>

      <section className="border-b border-hairline" aria-labelledby="standards-heading">
        <Container width="interior" className="py-12 md:py-[88px]">
          <SectionLabel id="standards-heading" className="mb-8 md:mb-10">
            The Standards
          </SectionLabel>

          <ul className="m-0 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {pillar.standards.map((standard, index) => (
              <li key={standard.label} className="bg-charcoal px-7 py-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[12px] tracking-[0.12em] text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="inline-block size-2 rotate-45 bg-iron" />
                </div>
                <h2 className="m-0 mb-3 font-display text-[22px] tracking-[0.02em]">
                  {standard.label}
                </h2>
                <p className="m-0 text-[14px] leading-[1.6] text-steel">{standard.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-l-2 border-gold py-2 pl-6 md:mt-12">
            <p className="m-0 mb-2 font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
              Start Here
            </p>
            <p className="m-0 max-w-[620px] text-[17px] leading-[1.55] font-medium text-bone md:text-[19px]">
              {pillar.start}
            </p>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-hairline" aria-labelledby="pillar-notes">
          <Container className="py-12 md:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <SectionLabel id="pillar-notes">Field Notes on {pillar.name}</SectionLabel>
              <Link
                href={`/field-notes?pillar=${pillar.category}`}
                className="border-b border-gold pb-1 font-mono text-[12px] tracking-[0.14em] text-gold uppercase transition-colors hover:text-bone"
              >
                All {pillar.name} Notes {'->'}
              </Link>
            </div>
            <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {related.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-hairline" aria-labelledby="other-pillars">
        <Container width="interior" className="py-12 md:py-[88px]">
          <SectionLabel id="other-pillars" className="mb-8">
            The Rest of the Code
          </SectionLabel>
          <ul className="m-0 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
            {others.map((item) => (
              <li key={item.slug} className="contents">
                <Link
                  href={item.href}
                  className="flex min-h-[44px] items-center gap-4 bg-charcoal px-5 py-5 text-bone transition-colors duration-150 hover:bg-charcoal-hover md:flex-col md:items-start md:gap-2 md:px-6 md:py-7"
                >
                  <span className="w-6 font-mono text-[11px] tracking-[0.12em] text-gold md:w-auto">
                    {item.num}
                  </span>
                  <span className="flex-1 font-display text-[21px] tracking-[0.04em] md:flex-none md:text-[26px]">
                    {item.name}
                  </span>
                  <span aria-hidden="true" className="font-mono text-[11px] text-iron">
                    {'->'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button asChild variant="outline" size="md">
              <Link href="/code">Read the Full Code</Link>
            </Button>
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  )
}
