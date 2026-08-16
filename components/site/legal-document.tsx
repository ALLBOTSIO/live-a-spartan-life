import { Container, SectionLabel } from '@/components/site/section'

/**
 * Shared shell for privacy/terms. Manrope body at reading width, Anton subheads,
 * gold diamond bullets — same system, no prose plugin needed.
 */
export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <section>
      <Container width="manifesto" className="py-12 md:py-20">
        <SectionLabel className="mb-6">Last updated — {updated}</SectionLabel>
        <h1 className="m-0 mb-8 font-display text-[clamp(36px,6vw,64px)] leading-[1.02] md:mb-12">
          {title}
        </h1>

        <div
          className={[
            'text-[16px] leading-[1.75] text-steel',
            '[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:tracking-[0.02em] [&_h2]:text-bone md:[&_h2]:text-[26px]',
            '[&_p]:my-4',
            '[&_strong]:font-bold [&_strong]:text-bone',
            '[&_a]:border-b [&_a]:border-gold [&_a]:text-bone [&_a]:transition-colors hover:[&_a]:text-gold',
            '[&_ul]:my-5 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:p-0',
            '[&_li]:relative [&_li]:pl-6',
            "[&_li]:before:absolute [&_li]:before:top-[9px] [&_li]:before:left-0 [&_li]:before:size-2 [&_li]:before:rotate-45 [&_li]:before:bg-gold [&_li]:before:content-['']",
          ].join(' ')}
        >
          {children}
        </div>
      </Container>
    </section>
  )
}
