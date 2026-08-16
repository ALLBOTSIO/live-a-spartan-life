import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { indexNav } from '@/lib/content/site'
import { Wordmark } from '@/components/site/wordmark'

export default function NotFound() {
  return (
    <main id="main" className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center px-5 md:px-8">
          <Wordmark size={17} markSize={9} />
        </div>
      </header>

      <div className="mx-auto max-w-[820px] px-5 py-20 md:px-8 md:py-28">
        <p className="m-0 mb-6 font-mono text-[12px] tracking-[0.2em] text-gold uppercase">
          404 / Off the Map
        </p>
        <h1 className="m-0 mb-6 font-display text-[clamp(44px,8vw,88px)] leading-[0.98]">
          That Page Does Not Exist.
        </h1>
        <p className="m-0 mb-10 max-w-[520px] text-[16px] leading-[1.7] text-steel">
          Nothing dramatic — the link is wrong or the page moved. Here is the index.
        </p>

        <ul className="m-0 mb-10 grid list-none gap-px border border-hairline bg-hairline p-0 md:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {indexNav.map((item) => (
            <li key={item.href} className="contents">
              <Link
                href={item.href}
                className="flex min-h-[44px] items-center gap-4 bg-charcoal px-5 py-4 text-bone transition-colors hover:bg-charcoal-hover"
              >
                <span className="w-6 font-mono text-[10px] tracking-[0.12em] text-gold">
                  {item.num}
                </span>
                <span className="font-display text-[19px] tracking-[0.05em] uppercase">
                  {item.label}
                </span>
                <span aria-hidden="true" className="ml-auto font-mono text-[10px] text-iron">
                  {'->'}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Button asChild>
          <Link href="/">Back to the Homepage</Link>
        </Button>
      </div>
    </main>
  )
}
