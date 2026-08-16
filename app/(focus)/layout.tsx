import Link from 'next/link'

import { Wordmark } from '@/components/site/wordmark'
import { site } from '@/lib/content/site'

/**
 * Focus chrome for the lead-magnet route.
 *
 * Stripped navigation is deliberate: `/start` has one job, and every nav link
 * is an exit. The wordmark stays clickable so the page is not a dead end.
 */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <>
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5 md:px-8">
          <Wordmark size={17} markSize={9} />
          <span className="hidden font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-iron uppercase sm:inline md:text-[11px]">
            /Start — The Spartan Starter
          </span>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-4 px-5 py-8 font-mono text-[10px] tracking-[0.1em] text-iron uppercase md:px-8">
          <span>
            © {year} {site.name} ·{' '}
            <Link href="/privacy" className="text-iron transition-colors hover:text-steel">
              Privacy
            </Link>{' '}
            ·{' '}
            <Link href="/terms" className="text-iron transition-colors hover:text-steel">
              Terms
            </Link>
          </span>
          <Link href="/" className="text-steel transition-colors hover:text-bone">
            Back to the site {'->'}
          </Link>
        </div>
      </footer>
    </>
  )
}
