import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Journal } from '@/components/field-notes/journal'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { ImageSlot } from '@/components/site/image-slot'
import { Container, SectionLabel } from '@/components/site/section'
import { formatPublishedAt, getArticles, getFeaturedArticle, toCardData } from '@/lib/content/articles'

export const metadata: Metadata = {
  title: 'Field Notes',
  description:
    'The journal. One useful note a week on training, fuel, mind, money, and brotherhood. No noise.',
  alternates: { canonical: '/field-notes' },
}

export default async function FieldNotesPage() {
  const articles = await getArticles()
  const featured = await getFeaturedArticle()
  // The featured story gets its own block above the grid — showing it twice
  // reads as a bug, so the grid carries everything else.
  const cards = articles.filter((article) => article.slug !== featured?.slug).map(toCardData)

  const heading = (
    <div>
      <SectionLabel tone="gold" className="mb-5">
        The Journal
      </SectionLabel>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-none uppercase">
        Field Notes
      </h1>
    </div>
  )

  const featuredBlock = featured ? (
    <Link
      href={`/field-notes/${featured.slug}`}
      className="group grid border border-hairline bg-charcoal lg:grid-cols-2"
    >
      <div className="relative min-h-[240px] md:min-h-[380px]">
        <ImageSlot
          id={`featured-${featured.slug}`}
          brief={featured.imageBrief}
          src={featured.image}
          alt={featured.title}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 md:px-11 md:py-12">
        <div className="mb-4 font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
          Featured · {featured.category}
        </div>
        <h2 className="m-0 mb-4 font-display text-[28px] leading-[1.1] text-balance transition-colors duration-150 group-hover:text-gold md:text-[38px]">
          {featured.title}
        </h2>
        <p className="m-0 mb-7 text-[15px] leading-[1.7] text-steel">{featured.excerpt}</p>
        <span className="font-mono text-[11px] tracking-[0.14em] text-iron uppercase">
          {featured.author} · {featured.readingMinutes} min read ·{' '}
          {formatPublishedAt(featured.publishedAt)}
        </span>
      </div>
    </Link>
  ) : null

  return (
    <>
      <Container className="pt-12 pb-16 md:pt-[72px] md:pb-20">
        <Suspense
          fallback={
            <div className="min-h-[400px]">
              {heading}
              <p className="pt-10 font-mono text-[11px] tracking-[0.16em] text-iron uppercase">
                Loading notes…
              </p>
            </div>
          }
        >
          <Journal articles={cards} heading={heading} featured={featuredBlock} />
        </Suspense>
      </Container>

      <section className="border-t border-hairline bg-charcoal" aria-labelledby="newsletter-heading">
        <Container width="narrow" className="py-14 text-center md:py-20">
          <h2 id="newsletter-heading" className="m-0 mb-[14px] font-display text-[28px] md:text-[36px]">
            Field Notes, Delivered.
          </h2>
          <p className="m-0 mb-7 text-[15px] leading-[1.65] text-steel">
            One useful note a week. Training, fuel, mind, money, brotherhood. No noise.
          </p>
          <NewsletterForm />
        </Container>
      </section>
    </>
  )
}
