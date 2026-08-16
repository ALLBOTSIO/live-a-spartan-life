import fs from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import { site } from '@/lib/content/site'

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Default share card, built from the brand board: carbon field, red diamond,
 * Anton wordmark, gold rule, mono tagline. Hard corners, no gradients.
 */
export default async function OpengraphImage() {
  const [anton, mono] = await Promise.all([
    fs.readFile(path.join(process.cwd(), 'public/fonts/Anton-Regular.ttf')),
    fs.readFile(path.join(process.cwd(), 'public/fonts/IBMPlexMono-Medium.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0C0C',
          padding: '72px',
          borderBottom: '10px solid #B22222',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 22, height: 22, background: '#B22222', transform: 'rotate(45deg)' }} />
          <div
            style={{
              fontFamily: 'Anton',
              fontSize: 30,
              letterSpacing: '0.06em',
              color: '#E9E5DC',
            }}
          >
            LIVE A SPARTAN LIFE
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 96, height: 3, background: '#D6A529', marginBottom: 32 }} />
          <div
            style={{
              fontFamily: 'Anton',
              fontSize: 92,
              lineHeight: 1,
              letterSpacing: '0.01em',
              color: '#E9E5DC',
              textTransform: 'uppercase',
            }}
          >
            Build strength.
          </div>
          <div
            style={{
              fontFamily: 'Anton',
              fontSize: 92,
              lineHeight: 1.05,
              letterSpacing: '0.01em',
              color: '#E9E5DC',
              textTransform: 'uppercase',
            }}
          >
            Lead with purpose.
          </div>
        </div>

        <div
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: 22,
            letterSpacing: '0.16em',
            color: '#9DA3A6',
            textTransform: 'uppercase',
          }}
        >
          THE FIVE-PILLAR CODE — LIVEASPARTANLIFE.COM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Anton', data: anton, style: 'normal', weight: 400 },
        { name: 'IBM Plex Mono', data: mono, style: 'normal', weight: 500 },
      ],
    },
  )
}
