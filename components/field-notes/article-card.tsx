import Link from 'next/link'

import { ImageSlot } from '@/components/site/image-slot'
import { cn } from '@/lib/utils'
import type { ArticleCardData } from '@/lib/content/articles'

/**
 * Field Notes card. `size` controls the reserved image box and title scale —
 * 240px/24px on the homepage, 200px/22px in the journal grid.
 */
export function ArticleCard({
  article,
  size = 'md',
  className,
}: {
  article: ArticleCardData
  size?: 'md' | 'lg'
  className?: string
}) {
  return (
    <Link
      href={`/field-notes/${article.slug}`}
      className={cn('group flex flex-col text-bone', className)}
    >
      <div className={cn('relative', size === 'lg' ? 'h-[240px]' : 'h-[200px]')}>
        <ImageSlot
          id={article.slug}
          brief={article.imageBrief}
          src={article.image}
          alt={article.title}
          sizes="(max-width: 840px) 100vw, 33vw"
        />
      </div>
      <div className={size === 'lg' ? 'pt-6' : 'pt-5'}>
        <div className="mb-[10px] font-mono text-[10.5px] tracking-[0.16em] text-gold uppercase md:mb-3">
          {article.category}
        </div>
        <h3
          className={cn(
            'm-0 mb-[10px] font-display leading-[1.2] tracking-[0.02em] text-balance transition-colors duration-150 group-hover:text-gold md:mb-3',
            size === 'lg' ? 'text-[24px]' : 'text-[22px]',
          )}
        >
          {article.title}
        </h3>
        <div className="font-mono text-[10.5px] tracking-[0.12em] text-iron uppercase">
          {article.meta}
        </div>
      </div>
    </Link>
  )
}
