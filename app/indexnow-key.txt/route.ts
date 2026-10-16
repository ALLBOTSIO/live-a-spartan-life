/**
 * IndexNow key file.
 *
 * IndexNow (Bing, Yandex, Seznam, Naver) proves host ownership by fetching a
 * text file containing the key. Submissions pass `keyLocation` pointing here,
 * so the key lives in an env var rather than a committed `public/<key>.txt`.
 *
 * Returns 404 until `INDEXNOW_KEY` is set, so nothing is advertised early.
 */

const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/

export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key || !KEY_PATTERN.test(key)) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
