import Link from 'next/link'

import { Wordmark } from '@/components/site/wordmark'
import { footerNav, site } from '@/lib/content/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline bg-carbon">
      <div className="mx-auto max-w-[1280px] px-5 pt-[72px] pb-10 xl:px-8">
        <div className="mb-16 grid gap-12 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          <div>
            <Wordmark size={22} className="mb-4" />
            <p className="m-0 max-w-[300px] text-[14px] leading-[1.65] text-iron">{site.tagline}</p>
          </div>

          {footerNav.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="flex flex-col gap-3 font-mono text-[11px] tracking-[0.12em] uppercase"
            >
              <span className="mb-1.5 text-iron">{column.heading}</span>
              {column.items.map((item) => {
                const external = item.href.startsWith('http')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-steel transition-colors duration-150 hover:text-bone"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-6 border-t border-hairline pt-7 font-mono text-[10.5px] tracking-[0.1em] text-iron uppercase">
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
          <span className="text-steel normal-case">“{site.quote}”</span>
        </div>
      </div>
    </footer>
  )
}
