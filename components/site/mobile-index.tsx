'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { indexNav } from '@/lib/content/site'

/**
 * The mobile menu is a field-manual index, not a slide-over drawer:
 * a full-width numbered list, one hairline between rows.
 *
 * State: `menuOpen`, default closed. Every row is ≥44px tall.
 */
export function MobileIndex() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  // Close on route change so a tap always lands on the new page, not the menu.
  // Adjusting state during render is the documented pattern for this — an
  // effect here would cause a cascading render.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // Escape closes. Cheap, expected, no library.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="min-h-[44px] cursor-pointer border border-iron bg-transparent px-[14px] py-3 font-mono text-[10px] tracking-[0.16em] text-bone uppercase transition-colors duration-150 hover:border-bone"
      >
        {open ? 'Close' : 'Index'}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-hairline bg-[#101112]"
      >
        <nav aria-label="Site index">
          {indexNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[44px] items-center gap-4 border-b border-[#1C2023] p-4 text-bone transition-colors duration-150 hover:bg-charcoal"
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
          ))}
        </nav>
      </div>
    </div>
  )
}
