import { cn } from '@/lib/utils'

const widths = {
  content: 'max-w-[1280px]',
  interior: 'max-w-[1100px]',
  manifesto: 'max-w-[820px]',
  start: 'max-w-[780px]',
  narrow: 'max-w-[720px]',
} as const

type Width = keyof typeof widths

export function Container({
  width = 'content',
  className,
  children,
}: {
  width?: Width
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mx-auto px-5 md:px-8', widths[width], className)}>{children}</div>
  )
}

export function Section({
  id,
  className,
  children,
  'aria-labelledby': ariaLabelledby,
}: {
  id?: string
  className?: string
  children: React.ReactNode
  'aria-labelledby'?: string
}) {
  return (
    <section id={id} aria-labelledby={ariaLabelledby} className={cn('border-b border-hairline', className)}>
      {children}
    </section>
  )
}

/**
 * Mono index label, e.g. "02 / THE SHIFT".
 * `tone` picks the surface: iron on carbon, gold for emphasis, bone-muted on bone.
 */
export function SectionLabel({
  children,
  tone = 'iron',
  rule = false,
  className,
  id,
}: {
  children: React.ReactNode
  tone?: 'iron' | 'gold' | 'bone-muted'
  rule?: boolean
  className?: string
  id?: string
}) {
  const toneClass = {
    iron: 'text-iron',
    gold: 'text-gold',
    'bone-muted': 'text-bone-muted',
  }[tone]

  return (
    <div
      id={id}
      className={cn(
        'flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase md:text-[12px]',
        toneClass,
        className,
      )}
    >
      {rule ? <span aria-hidden="true" className="inline-block h-px w-6 bg-gold md:w-8" /> : null}
      {children}
    </div>
  )
}

/** Anton section heading. Desktop 40–72px, mobile 32px. */
export function Heading({
  as: Tag = 'h2',
  id,
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-display text-[32px] leading-[1.05] text-balance md:text-[52px]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
