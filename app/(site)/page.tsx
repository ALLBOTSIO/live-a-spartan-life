import { BrotherhoodBand } from '@/components/home/brotherhood-band'
import { FieldNotesPreview } from '@/components/home/field-notes-preview'
import { FinalCta } from '@/components/home/final-cta'
import { Founder } from '@/components/home/founder'
import { Hero } from '@/components/home/hero'
import { Pillars } from '@/components/home/pillars'
import { Shift } from '@/components/home/shift'
import { Starter } from '@/components/home/starter'
import { getArticles, toCardData } from '@/lib/content/articles'
import { site } from '@/lib/content/site'
import { env } from '@/lib/env'

export default async function HomePage() {
  const articles = await getArticles()
  const latest = articles.slice(0, 3).map(toCardData)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: env.NEXT_PUBLIC_SITE_URL,
    description: site.description,
    slogan: site.tagline,
    founder: { '@type': 'Person', name: 'Jason Craig', alternateName: 'JROC' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Shift />
      <Pillars />
      <Starter />
      <Founder />
      <FieldNotesPreview articles={latest} />
      <BrotherhoodBand />
      <FinalCta />
    </>
  )
}
