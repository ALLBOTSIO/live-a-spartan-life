import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'

import { categories } from './pillars'

/**
 * Field Notes content layer.
 *
 * Articles start as MDX on disk (per the handoff) behind a narrow interface —
 * `getArticles` / `getArticle`. When the journal moves to Supabase Postgres,
 * swap the body of these two functions and nothing upstream changes.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content', 'field-notes')

const pillarCategories = categories.filter((c) => c !== 'ALL')

const frontmatterSchema = z.object({
  title: z.string().min(1),
  category: z.enum(pillarCategories as unknown as [string, ...string[]]),
  excerpt: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'publishedAt must be YYYY-MM-DD'),
  author: z.string().default('JROC'),
  featured: z.boolean().default(false),
  /** Photo brief for the shot this article needs. Becomes alt text once art lands. */
  imageBrief: z.string().min(1),
  /** Set once real art exists; until then the slot renders as a reserved placeholder. */
  image: z.string().optional(),
})

export type Article = z.infer<typeof frontmatterSchema> & {
  slug: string
  body: string
  /** Mono meta line, e.g. "FIELD NOTE · 6 MIN". */
  meta: string
}

function metaLine(readingMinutes: number) {
  return `FIELD NOTE · ${readingMinutes} MIN`
}

let cache: Article[] | null = null

export async function getArticles(): Promise<Article[]> {
  if (cache && process.env.NODE_ENV === 'production') return cache

  let filenames: string[] = []
  try {
    filenames = await fs.readdir(CONTENT_DIR)
  } catch {
    // No content directory yet — an empty journal is a valid state, not a crash.
    return []
  }

  const articles = await Promise.all(
    filenames
      .filter((name) => name.endsWith('.mdx'))
      .map(async (name): Promise<Article> => {
        const raw = await fs.readFile(path.join(CONTENT_DIR, name), 'utf8')
        const { data, content } = matter(raw)
        const parsed = frontmatterSchema.safeParse(data)
        if (!parsed.success) {
          throw new Error(
            `Invalid frontmatter in content/field-notes/${name}: ${parsed.error.issues
              .map((i) => `${i.path.join('.')} ${i.message}`)
              .join('; ')}`,
          )
        }
        return {
          ...parsed.data,
          slug: name.replace(/\.mdx$/, ''),
          body: content,
          meta: metaLine(parsed.data.readingMinutes),
        }
      }),
  )

  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  cache = articles
  return articles
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug)
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find((a) => a.featured) ?? articles[0]
}

/** Serializable shape handed to the client-side Field Notes filter. */
export type ArticleCardData = Pick<
  Article,
  'slug' | 'title' | 'category' | 'meta' | 'imageBrief' | 'image' | 'excerpt'
>

export function toCardData(article: Article): ArticleCardData {
  return {
    slug: article.slug,
    title: article.title,
    category: article.category,
    meta: article.meta,
    imageBrief: article.imageBrief,
    image: article.image,
    excerpt: article.excerpt,
  }
}

export function formatPublishedAt(publishedAt: string): string {
  const date = new Date(`${publishedAt}T00:00:00Z`)
  return date
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()
}
