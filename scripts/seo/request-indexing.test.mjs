import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildUrls, inspectHtml, isDisallowed, parseArgs, sitemapLocs } from './request-indexing.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
const { pages } = JSON.parse(fs.readFileSync(path.join(HERE, 'priority-pages.json'), 'utf8'))

test('every priority path maps to a real route', () => {
  const pillarSlugs = [...fs.readFileSync(path.join(ROOT, 'lib/content/pillars.ts'), 'utf8').matchAll(/slug: '([a-z]+)'/g)].map((m) => m[1])
  for (const { path: p } of pages) {
    if (p === '/') {
      assert.ok(fs.existsSync(path.join(ROOT, 'app/(site)/page.tsx')))
      continue
    }
    const seg = p.slice(1)
    const exists = ['(site)', '(focus)'].some((group) => fs.existsSync(path.join(ROOT, 'app', group, seg, 'page.tsx')))
    assert.ok(exists || pillarSlugs.includes(seg), `no route for ${p}`)
  }
})

test('every priority path is in the sitemap source', () => {
  const sitemap = fs.readFileSync(path.join(ROOT, 'app/sitemap.ts'), 'utf8')
  const pillars = fs.readFileSync(path.join(ROOT, 'lib/content/pillars.ts'), 'utf8')
  for (const { path: p } of pages) {
    const inStatic = sitemap.includes(`\${base}${p}\``)
    const inPillars = pillars.includes(`href: '${p}'`)
    assert.ok(inStatic || inPillars, `${p} missing from app/sitemap.ts`)
  }
})

test('no priority path is disallowed by app/robots.ts rules', () => {
  const robots = fs.readFileSync(path.join(ROOT, 'app/robots.ts'), 'utf8')
  const disallow = JSON.parse(robots.match(/disallow: (\[[^\]]*\])/)[1].replace(/'/g, '"'))
  const txt = `User-agent: *\nAllow: /\n${disallow.map((d) => `Disallow: ${d}`).join('\n')}\n`
  for (const { path: p } of pages) assert.equal(isDisallowed(txt, p), false, p)
})

test('buildUrls joins paths to the origin and rejects duplicates', () => {
  assert.deepEqual(buildUrls('https://www.liveaspartanlife.com', [{ path: '/' }, { path: '/start' }]), [
    'https://www.liveaspartanlife.com/',
    'https://www.liveaspartanlife.com/start',
  ])
  assert.throws(() => buildUrls('https://x.com', [{ path: '/a' }, { path: '/a' }]), /Duplicate/)
  assert.throws(() => buildUrls('https://x.com', [{ path: 'a' }]), /must start/)
})

test('isDisallowed only applies the * group', () => {
  const txt = 'User-agent: Googlebot\nDisallow: /start\n\nUser-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /account\n'
  assert.equal(isDisallowed(txt, '/start'), false)
  assert.equal(isDisallowed(txt, '/api/checkout'), true)
  assert.equal(isDisallowed(txt, '/account'), true)
  assert.equal(isDisallowed(txt, '/'), false)
})

test('sitemapLocs extracts loc values', () => {
  const xml = '<urlset><url><loc>https://a.com/</loc></url><url><loc> https://a.com/b </loc></url></urlset>'
  assert.deepEqual(sitemapLocs(xml), ['https://a.com/', 'https://a.com/b'])
})

test('inspectHtml detects noindex and canonical in either attribute order', () => {
  assert.deepEqual(inspectHtml('<meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://a.com/x">'), {
    noindex: true,
    canonical: 'https://a.com/x',
  })
  assert.deepEqual(inspectHtml('<link href="https://a.com/y" rel="canonical"/>'), { noindex: false, canonical: 'https://a.com/y' })
  assert.deepEqual(inspectHtml('<meta name="robots" content="index, follow">'), { noindex: false, canonical: null })
})

test('parseArgs defaults to preflight-only against production', () => {
  assert.deepEqual(parseArgs([]), { base: 'https://www.liveaspartanlife.com', submit: false, out: null })
  assert.deepEqual(parseArgs(['--submit', '--base', 'https://x.com/', '--out', 'e.json']), { base: 'https://x.com', submit: true, out: 'e.json' })
  assert.throws(() => parseArgs(['--bogus']), /Unknown argument/)
})
