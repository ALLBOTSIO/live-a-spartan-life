#!/usr/bin/env node
/**
 * Launch indexing request for priority pages (gate G21).
 *
 *   node scripts/seo/request-indexing.mjs                 # preflight only, no submission
 *   INDEXNOW_KEY=... node scripts/seo/request-indexing.mjs --submit --out docs/seo/evidence/<date>.json
 *
 * 1. Preflight every priority URL: 200 with no redirect, no `noindex`, canonical
 *    matches, not disallowed by robots.txt, listed in sitemap.xml.
 * 2. With --submit: verify the live IndexNow key file, then POST the URL list to
 *    api.indexnow.org (shared by Bing, Yandex, Seznam, Naver).
 * 3. Print the Google Search Console "Request indexing" checklist. Google has no
 *    public API for that action on ordinary pages — it is a manual step.
 *
 * No dependencies; Node 18+ (global fetch).
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_BASE = 'https://www.liveaspartanlife.com'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const KEY_PATH = '/indexnow-key.txt'
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/

export function parseArgs(argv) {
  const args = { base: DEFAULT_BASE, submit: false, out: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--submit') args.submit = true
    else if (arg === '--base') args.base = argv[++i]
    else if (arg === '--out') args.out = argv[++i]
    else throw new Error(`Unknown argument: ${arg}`)
  }
  args.base = args.base.replace(/\/$/, '')
  return args
}

export function buildUrls(base, pages) {
  const origin = new URL(base).origin
  const seen = new Set()
  return pages.map(({ path: p }) => {
    if (!p.startsWith('/')) throw new Error(`Priority path must start with "/": ${p}`)
    const url = new URL(p, origin).href
    if (seen.has(url)) throw new Error(`Duplicate priority path: ${p}`)
    seen.add(url)
    return url
  })
}

/** Minimal robots.txt check for the `*` group — enough for our own simple file. */
export function isDisallowed(robotsTxt, pathname) {
  let inStar = false
  const disallow = []
  for (const raw of robotsTxt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim()
    const [field, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    if (/^user-agent$/i.test(field)) inStar = value === '*'
    else if (inStar && /^disallow$/i.test(field) && value) disallow.push(value)
  }
  return disallow.some((prefix) => pathname.startsWith(prefix))
}

export function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
}

export function inspectHtml(html) {
  const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? ''
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] ??
    null
  return { noindex: /noindex/i.test(robotsMeta), canonical }
}

function sameUrl(a, b) {
  const norm = (u) => new URL(u).href.replace(/\/$/, '')
  return norm(a) === norm(b)
}

async function preflight(url, { robotsTxt, locs }) {
  const problems = []
  const warnings = []
  let status = null
  try {
    const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'LSL-indexing-preflight' } })
    status = res.status
    if (status !== 200) problems.push(`HTTP ${status}${res.headers.get('location') ? ` -> ${res.headers.get('location')}` : ''}`)
    if (/noindex/i.test(res.headers.get('x-robots-tag') ?? '')) problems.push('X-Robots-Tag noindex')
    if (status === 200) {
      const { noindex, canonical } = inspectHtml(await res.text())
      if (noindex) problems.push('meta robots noindex')
      if (!canonical) warnings.push('no canonical tag')
      else if (!sameUrl(new URL(canonical, url).href, url)) problems.push(`canonical points elsewhere: ${canonical}`)
    }
  } catch (error) {
    problems.push(`fetch failed: ${error.message}`)
  }
  if (isDisallowed(robotsTxt, new URL(url).pathname)) problems.push('disallowed by robots.txt')
  if (!locs.some((loc) => sameUrl(loc, url))) warnings.push('not listed in sitemap.xml')
  return { url, status, ok: problems.length === 0, problems, warnings }
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`)
  return res.text()
}

async function submitIndexNow(base, key, urls) {
  const keyLocation = `${base}${KEY_PATH}`
  const live = (await fetchText(keyLocation).catch(() => '')).trim()
  if (live !== key) {
    return { submitted: false, error: `Key file at ${keyLocation} does not match INDEXNOW_KEY — deploy with INDEXNOW_KEY set first.` }
  }
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(base).host, key, keyLocation, urlList: urls }),
  })
  // 200 = accepted, 202 = accepted pending key validation. Anything else is a failure.
  return {
    submitted: res.status === 200 || res.status === 202,
    endpoint: INDEXNOW_ENDPOINT,
    httpStatus: res.status,
    body: (await res.text()).slice(0, 500),
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { pages } = JSON.parse(await fs.readFile(path.join(HERE, 'priority-pages.json'), 'utf8'))
  const urls = buildUrls(args.base, pages)

  const robotsTxt = await fetchText(`${args.base}/robots.txt`).catch(() => '')
  const sitemapXml = await fetchText(`${args.base}/sitemap.xml`).catch(() => '')
  const locs = sitemapLocs(sitemapXml)
  const leaks = locs.filter((loc) => /localhost|127\.0\.0\.1/.test(loc))

  const checks = []
  for (const url of urls) checks.push(await preflight(url, { robotsTxt, locs }))

  const evidence = {
    gate: 'G21',
    requirement: 'Indexing request completed for priority pages',
    ranAt: new Date().toISOString(),
    base: args.base,
    robotsTxtFetched: Boolean(robotsTxt),
    sitemap: { fetched: Boolean(sitemapXml), locCount: locs.length, localhostLeaks: leaks },
    preflight: checks,
    indexNow: { submitted: false, reason: args.submit ? null : 'preflight only (no --submit flag)' },
    googleSearchConsole: {
      method: 'manual — URL Inspection > Request indexing',
      status: 'PENDING — record date and operator per URL in docs/seo/INDEXING.md',
      urls,
    },
  }

  const preflightOk = checks.every((c) => c.ok) && evidence.sitemap.fetched && leaks.length === 0
  if (args.submit) {
    const key = process.env.INDEXNOW_KEY
    if (!preflightOk) evidence.indexNow = { submitted: false, reason: 'preflight failed — nothing submitted' }
    else if (!key || !KEY_PATTERN.test(key)) evidence.indexNow = { submitted: false, reason: 'INDEXNOW_KEY missing or invalid' }
    else evidence.indexNow = await submitIndexNow(args.base, key, urls)
  }

  for (const c of checks) {
    const flag = c.ok ? 'PASS' : 'FAIL'
    console.error(`${flag}  ${c.url}${c.problems.length ? `  — ${c.problems.join('; ')}` : ''}${c.warnings.length ? `  (warn: ${c.warnings.join('; ')})` : ''}`)
  }
  if (!evidence.sitemap.fetched) console.error('FAIL  sitemap.xml could not be fetched')
  if (leaks.length) console.error(`FAIL  sitemap.xml contains ${leaks.length} localhost URL(s)`)
  console.error(`IndexNow: ${evidence.indexNow.submitted ? `submitted (HTTP ${evidence.indexNow.httpStatus})` : `NOT submitted — ${evidence.indexNow.reason ?? evidence.indexNow.error ?? `HTTP ${evidence.indexNow.httpStatus}`}`}`)
  console.error('Google Search Console: manual "Request indexing" still required for each URL above.')

  const json = JSON.stringify(evidence, null, 2)
  if (args.out) {
    await fs.mkdir(path.dirname(args.out), { recursive: true })
    await fs.writeFile(args.out, `${json}\n`)
    console.error(`Evidence written to ${args.out}`)
  } else {
    console.log(json)
  }

  if (!preflightOk || (args.submit && !evidence.indexNow.submitted)) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
