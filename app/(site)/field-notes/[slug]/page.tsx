import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { ArticleCard } from '@/components/field-notes/article-card'
import { articleComponents } from '@/components/field-notes/mdx-components'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { ImageSlot } from '@/components/site/image-slot'
import { Container, SectionLabel } from '@/components/site/section'
import {
  formatPublishedAt,
  getArticle,
  getArticles,
  toCardData,
} from '@/lib/content/articles'
import { env } from '@/lib/env'
import { site } from '@/lib/content/site'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Note not found' }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/field-notes/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
      url: `/field-notes/${article.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const all = await getArticles()
  const related = all
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3)
  const more = (related.length > 0 ? related : all.filter((i) => i.slug !== article.slug).slice(0, 3))
    .map(toCardData)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: `${env.NEXT_PUBLIC_SITE_URL}/field-notes/${article.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Container width="manifesto" className="pt-12 pb-10 md:pt-[72px]">
          <Link
            href={`/field-notes?pillar=${article.category}`}
            className="font-mono text-[11px] tracking-[0.16em] text-gold uppercase transition-colors hover:text-bone"
          >
            {'<-'} {article.category}
          </Link>

          <h1 className="mt-6 mb-5 font-display text-[clamp(34px,5vw,56px)] leading-[1.05] text-balance">
            {article.title}
          </h1>

          <p className="m-0 mb-6 text-[17px] leading-[1.7] text-steel">{article.excerpt}</p>

          <div className="font-mono text-[11px] tracking-[0.14em] text-iron uppercase">
            {article.author} · {article.readingMinutes} min read ·{' '}
            {formatPublishedAt(article.publishedAt)}
          </div>
        </Container>

        <Container width="manifesto" className="pb-10">
          <div className="relative h-[240px] md:h-[420px]">
            <ImageSlot
              id={article.slug}
              brief={article.imageBrief}
              src={article.image}
              alt={article.title}
              priority
              sizes="(max-width: 840px) 100vw, 820px"
            />
          </div>
        </Container>

        <Container width="manifesto" className="pb-16 md:pb-20">
          <MDXRemote source={article.body} components={articleComponents} />
        </Container>
      </article>

      <section className="border-t border-hairline bg-charcoal" aria-labelledby="article-newsletter">
        <Container width="narrow" className="py-14 text-center md:py-20">
          <h2 id="article-newsletter" className="m-0 mb-[14px] font-display text-[28px] md:text-[36px]">
            Field Notes, Delivered.
          </h2>
          <p className="m-0 mb-7 text-[15px] leading-[1.65] text-steel">
            One useful note a week. Training, fuel, mind, money, brotherhood. No noise.
          </p>
          <NewsletterForm source="article" />
        </Container>
      </section>

      {more.length > 0 ? (
        <section className="border-t border-hairline" aria-labelledby="more-notes">
          <Container className="py-12 md:py-20">
            <SectionLabel id="more-notes" className="mb-8">
              Keep Reading
            </SectionLabel>
            <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {more.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
