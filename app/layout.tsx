import type { Metadata, Viewport } from 'next'
import { Anton, IBM_Plex_Mono, Manrope } from 'next/font/google'

import { Scanline } from '@/components/site/scanline'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { getSiteUrl } from '@/lib/env'
import { site } from '@/lib/content/site'

import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0B0C0C',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="bg-carbon text-bone font-sans antialiased">
        <AnalyticsProvider>
          <Scanline />
          <a href="#main" className="skip-link">
            SKIP TO CONTENT
          </a>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
