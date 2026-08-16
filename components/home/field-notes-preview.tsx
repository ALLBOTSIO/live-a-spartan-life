import Link from 'next/link'

import { ArticleCard } from '@/components/field-notes/article-card'
import { Container, Heading, Section, SectionLabel } from '@/components/site/section'
import type { ArticleCardData } from '@/lib/content/articles'

/** 06 / FIELD NOTES — three most recent notes. */
export function FieldNotesPreview({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null

  return (
    <Section id="field-notes" aria-labelledby="field-notes-heading">
      <Container className="py-12 md:py-[110px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12 md:gap-8">
          <div>
            <SectionLabel className="mb-[18px] md:mb-6">06 / Field Notes</SectionLabel>
            <Heading id="field-notes-heading" className="m-0 text-bone md:text-[48px]">
              From the Journal
            </Heading>
          </div>
          <Link
            href="/field-notes"
            className="border-b border-gold pb-1 font-mono text-[12px] tracking-[0.14em] text-gold uppercase transition-colors duration-150 hover:text-bone"
          >
            Read Field Notes {'->'}
          </Link>
        </div>

        <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} size="lg" />
          ))}
        </div>
      </Container>
    </Section>
  )
}
