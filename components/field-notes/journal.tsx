'use client'

import { useCallback, useId, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ArticleCard } from '@/components/field-notes/article-card'
import { SrOnlyLabel } from '@/components/ui/label'
import { capture } from '@/lib/analytics'
import { categories } from '@/lib/content/pillars'
import type { ArticleCardData } from '@/lib/content/articles'
import { cn } from '@/lib/utils'

type JournalProps = {
  articles: ArticleCardData[]
  /** Server-rendered heading block, placed beside the search field. */
  heading: React.ReactNode
  /** Server-rendered featured story, placed between the controls and the grid. */
  featured?: React.ReactNode
}

/**
 * Field Notes hub — search + category filter, client-side, no page reload.
 *
 * One component owns both controls so they cannot disagree. State mirrors to
 * `?pillar=` and `?q=` so a filtered view is shareable, and the static heading
 * and featured blocks stay server-rendered by passing through as props.
 */
export function Journal({ articles, heading, featured }: JournalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchId = useId()

  const initialPillar = (searchParams.get('pillar') ?? 'ALL').toUpperCase()
  const [category, setCategory] = useState(
    categories.includes(initialPillar as (typeof categories)[number]) ? initialPillar : 'ALL',
  )
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const syncParams = useCallback(
    (nextCategory: string, nextQuery: string) => {
      const params = new URLSearchParams()
      if (nextCategory !== 'ALL') params.set('pillar', nextCategory)
      if (nextQuery.trim()) params.set('q', nextQuery.trim())
      const search = params.toString()
      router.replace(search ? `/field-notes?${search}` : '/field-notes', { scroll: false })
    },
    [router],
  )

  const onCategory = (next: string) => {
    setCategory(next)
    syncParams(next, query)
    capture('field_notes_filtered', { pillar: next })
  }

  const onQuery = (next: string) => {
    setQuery(next)
    syncParams(category, next)
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return articles.filter((article) => {
      if (category !== 'ALL' && article.category !== category) return false
      if (!needle) return true
      return (
        article.title.toLowerCase().includes(needle) ||
        article.excerpt.toLowerCase().includes(needle) ||
        article.category.toLowerCase().includes(needle)
      )
    })
  }, [articles, category, query])

  const searchField = (
    <>
      <SrOnlyLabel htmlFor={searchId}>Search the notes</SrOnlyLabel>
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search the notes…"
        className="min-h-[44px] w-full border border-input-border bg-charcoal px-[18px] py-[14px] font-mono text-[12px] tracking-[0.06em] text-bone outline-none placeholder:text-iron focus-visible:border-steel md:w-[280px]"
      />
    </>
  )

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 md:gap-8">
        {heading}
        <div className="w-full md:w-auto">{searchField}</div>
      </div>

      <div
        role="group"
        aria-label="Filter by pillar"
        className="mt-8 flex flex-wrap gap-[10px] border-t border-hairline pt-6 md:mt-9"
      >
        {categories.map((option) => {
          const active = option === category
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onCategory(option)}
              className={cn(
                'min-h-[44px] cursor-pointer border px-[18px] py-[10px] font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-150',
                active
                  ? 'border-red bg-red text-bone'
                  : 'border-input-border bg-transparent text-steel hover:border-steel hover:text-bone',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      {category === 'ALL' && !query.trim() && featured ? (
        <div className="pt-10 md:pt-12">{featured}</div>
      ) : null}

      <div
        className="pt-10 md:pt-12"
        role="region"
        aria-live="polite"
        aria-label={`${visible.length} field ${visible.length === 1 ? 'note' : 'notes'}`}
      >
        {visible.length === 0 ? (
          <p className="m-0 border border-dashed border-input-border px-7 py-10 text-center font-mono text-[11px] tracking-[0.16em] text-iron uppercase">
            No notes match that filter yet.
          </p>
        ) : (
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {visible.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
