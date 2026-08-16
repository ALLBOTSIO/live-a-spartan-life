import Link from 'next/link'

import { cn } from '@/lib/utils'
import { site } from '@/lib/content/site'

type WordmarkProps = {
  /** Wordmark type size in px. Header 19, footer 22, interior 17, mobile 15. */
  size?: number
  /** Diamond size in px. */
  markSize?: number
  className?: string
  /** Render as a link to home. Off when the wordmark is already the home page H1 context. */
  asLink?: boolean
}

/**
 * Logo Route A — wordmark preceded by a red square rotated 45°.
 * The recommended primary lockup from the brand board.
 */
export function Wordmark({
  size = 19,
  markSize = 10,
  className,
  asLink = true,
}: WordmarkProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="inline-block shrink-0 rotate-45 bg-red"
        style={{ width: markSize, height: markSize }}
      />
      <span className="whitespace-nowrap">{site.name.toUpperCase()}</span>
    </>
  )

  const classes = cn(
    'flex items-center gap-[10px] font-display text-bone transition-colors duration-150',
    className,
  )
  const style = { fontSize: size, letterSpacing: '0.06em' }

  if (!asLink) {
    return (
      <span className={classes} style={style}>
        {content}
      </span>
    )
  }

  return (
    <Link href="/" className={classes} style={style} aria-label={`${site.name} — home`}>
      {content}
    </Link>
  )
}
