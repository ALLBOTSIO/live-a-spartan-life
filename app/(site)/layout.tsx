import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

/**
 * Standard site chrome: sticky header with persistent CTA, global footer.
 *
 * Note on the design bundle: the interior `.dc.html` previews each show a
 * stripped header with a mono route label. The handoff's behaviour spec is the
 * authority for cross-page navigation ("Header is sticky on all pages; the CTA
 * button persists on every route"), so every route uses this chrome except
 * `/start`, which the handoff explicitly carves out as stripped.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
