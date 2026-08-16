import { scanlineEnabled } from '@/lib/env'

/**
 * Global texture overlay — a fixed 1px scanline grid at 5% opacity.
 *
 * Ships behind NEXT_PUBLIC_FEATURE_SCANLINE (default on, set to "false" to kill).
 * It is `pointer-events-none` and `aria-hidden` and must never intercept clicks.
 */
export function Scanline() {
  if (!scanlineEnabled) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 opacity-5"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, #E9E5DC 2px, #E9E5DC 3px)',
      }}
    />
  )
}
