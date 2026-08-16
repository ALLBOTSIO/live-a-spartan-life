'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

if (typeof window !== 'undefined' && posthogKey && !posthog.__loaded) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    // App Router does not fire a pageview on client navigation — we send them.
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
  })
}

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!posthogKey) return
    const query = searchParams.toString()
    posthog.capture('$pageview', {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ''}`,
    })
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!posthogKey) return <>{children}</>

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}
