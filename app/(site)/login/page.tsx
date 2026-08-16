import { Suspense } from 'react'
import type { Metadata } from 'next'

import { LoginForm } from '@/components/auth/login-form'
import { Container, SectionLabel } from '@/components/site/section'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to the Brotherhood member area.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <Container width="start" className="py-16 md:py-24">
      <SectionLabel tone="gold" className="mb-6">
        Members
      </SectionLabel>
      <h1 className="m-0 mb-5 font-display text-[clamp(36px,6vw,64px)] leading-[1.02]">Sign In.</h1>
      <p className="m-0 mb-10 max-w-[520px] text-[16px] leading-[1.7] text-steel">
        No password to remember. Enter your email and we will send a one-time sign-in link.
      </p>

      <div className="max-w-[520px] border border-hairline bg-charcoal p-6 md:p-9">
        <Suspense
          fallback={
            <p className="m-0 font-mono text-[11px] tracking-[0.16em] text-iron uppercase">
              Loading…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </Container>
  )
}
