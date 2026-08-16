'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          await createClient().auth.signOut()
          router.push('/')
          router.refresh()
        } finally {
          setBusy(false)
        }
      }}
      className="min-h-[44px] cursor-pointer border border-iron bg-transparent px-6 py-3 font-mono text-[11px] tracking-[0.14em] text-bone uppercase transition-colors duration-150 hover:border-bone disabled:opacity-70"
    >
      {busy ? 'Signing out…' : 'Sign Out'}
    </button>
  )
}
