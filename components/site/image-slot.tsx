import Image from 'next/image'

import { cn } from '@/lib/utils'

type ImageSlotProps = {
  /** Slot id from the photo brief, e.g. "hero-jroc". Shown on the reserved state. */
  id: string
  /** The shot needed. Doubles as alt text once real art is dropped in. */
  brief: string
  /** Set when final art exists. Until then the slot renders as a reserved placeholder. */
  src?: string
  alt?: string
  /** Low-quality blur placeholder, if the asset pipeline produced one. */
  blurDataURL?: string
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Photography drop target.
 *
 * All site photography is placeholder at handoff — every slot renders a reserved
 * state carrying its photo brief. Passing `src` swaps in a real `next/image`
 * with no layout shift: the caller reserves the box, this fills it.
 */
export function ImageSlot({
  id,
  brief,
  src,
  alt,
  blurDataURL,
  priority = false,
  sizes = '(max-width: 840px) 100vw, 50vw',
  className,
}: ImageSlotProps) {
  if (src) {
    return (
      <div className={cn('relative h-full w-full overflow-hidden bg-charcoal', className)}>
        <Image
          src={src}
          alt={alt ?? brief}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Reserved photography: ${brief}`}
      data-slot={id}
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 border border-hairline bg-charcoal p-6 text-center',
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block size-2 rotate-45 bg-iron" />
      <span className="font-mono text-[10px] tracking-[0.16em] text-iron uppercase">
        Image reserved — {id}
      </span>
      <span className="max-w-[280px] font-mono text-[11px] leading-[1.6] tracking-[0.06em] text-steel">
        {brief}
      </span>
    </div>
  )
}

/** Mono figure caption notched into the bottom-left corner of an image box. */
export function FigureCaption({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute -bottom-px -left-px bg-carbon pt-2 pr-3 font-mono text-[10px] tracking-[0.16em] text-iron uppercase">
      {children}
    </div>
  )
}
