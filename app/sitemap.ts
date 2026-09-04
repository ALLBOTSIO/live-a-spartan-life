import type { MetadataRoute } from 'next'

import { getArticles } from '@/lib/content/articles'
import { pillarRoutes } from '@/lib/content/pillars'
import { getSiteUrl } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().replace(/\/$/, '')

  let articles: Awaited<ReturnType<typeof getArticles>> = []
  try {
    articles = await getArticles()
  } catch (error) {
    console.error('Failed to load articles for sitemap:', error)
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${base}/start`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/brotherhood`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/code`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/field-notes`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/about`, priority: 0.7, changeFrequency: 'yearly' },
    { url: `${base}/gear`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${base}/privacy`, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.2, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes,
    ...pillarRoutes.map((pillar) => ({
      url: `${base}${pillar.href}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })),
    ...articles.map((article) => ({
      url: `${base}/field-notes/${article.slug}`,
      lastModified: new Date(`${article.publishedAt}T00:00:00Z`),
      priority: 0.6,
      changeFrequency: 'yearly' as const,
    })),
  ]
}
