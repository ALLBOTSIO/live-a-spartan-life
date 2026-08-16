import Link from 'next/link'

import { MobileIndex } from '@/components/site/mobile-index'
import { Wordmark } from '@/components/site/wordmark'
import { primaryNav } from '@/lib/content/site'

/**
 * Sticky global header — 68px on desktop, 60px on mobile.
 *
 * The red CTA persists on every route. Below `xl` the nav collapses into the
 * field-manual INDEX menu (a bordered button, deliberately not a hamburger).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-carbon/92 backdrop-blur-[8px]">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-6 px-5 xl:h-[68px] xl:px-8">
        <Wordmark size={15} markSize={8} className="xl:!text-[19px]" />

        <nav aria-label="Primary" className="hidden min-w-0 justify-center gap-[26px] xl:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.14em] text-steel uppercase transition-colors duration-150 hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/start"
            className="hidden bg-red px-5 py-3 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap text-bone uppercase transition-colors duration-150 hover:bg-red-hover sm:inline-block"
          >
            Get the Spartan Starter
          </Link>
          <MobileIndex />
        </div>
      </div>
    </header>
  )
}
