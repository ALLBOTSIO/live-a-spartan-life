# Live a Spartan Life

Production Next.js App Router build of **liveaspartanlife.com** — the brand system and page
designs from `design_handoff_live_a_spartan_life/` recreated as idiomatic React + Tailwind
components. The preview runtime (`support.js`, `<x-dc>`, `<sc-for>`, `<image-slot>`) was **not**
ported; nothing from `design_files/` ships.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Components | shadcn/ui primitives, restyled to the brand |
| Auth + DB | Supabase (Auth + Postgres, RLS on) |
| Payments | Stripe Checkout + webhook (Brotherhood, $24/mo) |
| Email | Resend |
| Analytics | PostHog |
| Deploy | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

The site runs with **zero** integrations configured — every service degrades to a clear message
rather than a crash, so you can preview and deploy before keys exist. Signup forms return a
"not available yet" error until Supabase is connected.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `Homepage.dc.html` + `Homepage Mobile.dc.html` | Eight sections, hero treatment **1a** |
| `/start` | `Start Page.dc.html` | Stripped chrome (`app/(focus)`) — the only route without site nav |
| `/brotherhood` | `Brotherhood Page.dc.html` | Stripe Checkout CTA |
| `/field-notes` | `Field Notes.dc.html` | Client-side filter + search, synced to `?pillar=` / `?q=` |
| `/field-notes/[slug]` | — | MDX article pages |
| `/about` | `About Page.dc.html` | |
| `/code`, `/train`, `/fuel`, `/mind`, `/provide`, `/gear` | — | "Still to design" in the handoff; built on the same system so no nav link dead-ends |
| `/login`, `/account` | — | Supabase magic-link auth, member area gated by `proxy.ts` |
| `/privacy`, `/terms` | — | **Drafts — require review by counsel before launch** |

## Design decisions worth knowing

- **Hero 1a** (split editorial) is built. 1b (full-bleed) and 1c (field-manual index) stay in the
  design bundle as alternates; switching is a change to `components/home/hero.tsx` only.
- **Header on interior pages.** The interior `.dc.html` previews each show a stripped header with a
  mono route label. The handoff's behaviour spec is the authority for cross-page navigation
  ("Header is sticky on all pages; the CTA button persists on every route"), so every route uses
  the full chrome except `/start`, which the handoff explicitly carves out.
- **Homepage inline form.** The handoff says pick one and be consistent — the homepage Starter form
  submits inline (section 04); every other "GET THE STARTER" CTA routes to `/start`.
- **Nav width.** The desktop bar carries the eight items from `Homepage.dc.html`. "Start Here" is
  the persistent red CTA and "Gear" lives in the footer; adding either to the bar overflows 1280px.
- **Scanline** ships behind `NEXT_PUBLIC_FEATURE_SCANLINE` (default on). It is `pointer-events:none`
  and `aria-hidden`.
- **Hard corners and no shadows** are enforced in the token layer — every Tailwind radius and shadow
  scale is zeroed in `@theme`, so a stray `rounded-lg` cannot reintroduce them.

## Photography

**All photography is placeholder.** Every slot renders `components/site/image-slot.tsx` in its
reserved state, carrying its photo brief on screen. Drop real art in by passing `src` — the box is
already reserved, so nothing shifts.

| Slot | Shot needed |
|---|---|
| `hero-jroc` | JROC training scene — hard directional light, desaturated, cinematic |
| `founder-portrait` / `about-portrait` | JROC documentary portrait, natural light |
| Article slots | Set per article in `content/field-notes/*.mdx` (`imageBrief` frontmatter) |

Art direction: documentary, cinematic, desaturated or monochrome, hard directional or late-afternoon
light. Real men, real environments. **No** stock smiles, staged shirtless fitness, ancient helmets,
Roman statues, flames, skulls, or weapons.

## Content

Field Notes are MDX in `content/field-notes/`. Frontmatter is validated at read time
(`lib/content/articles.ts`) — a malformed file fails the build with the field name, rather than
rendering a broken card. Moving the journal to Postgres later means changing `getArticles` /
`getArticle` and nothing upstream.

The five pillar names and one-line definitions are final brand copy. The longer pillar-page copy in
`lib/content/pillars.ts` and the seven article bodies are **first drafts written in the brand voice
for JROC to edit** — no claims, results, testimonials, customers, or partnerships were invented.

## Supabase

```bash
supabase db push   # or paste supabase/migrations/0001_init.sql into the SQL editor
```

Two tables. `subscribers` has RLS on with **no policies** — the browser gets nothing; only the
service-role key used by the route handlers can write. `profiles` is owner-read/owner-write and is
created automatically by a trigger on `auth.users`.

## Stripe

1. Create a recurring $24/month price → set `STRIPE_BROTHERHOOD_PRICE_ID`.
2. Add a webhook endpoint at `https://<domain>/api/stripe/webhook` for
   `checkout.session.completed`, `customer.subscription.created`, `.updated`, `.deleted` →
   set `STRIPE_WEBHOOK_SECRET`.

The webhook is the **only** writer of subscription state; the success redirect is cosmetic. The
price lives on the server — the client never sends an amount.

## Accessibility

- Bone on carbon and carbon on bone clear AAA. `#9DA3A6` is the dimmest colour used for anything a
  reader must read; `#62686C` is decorative metadata only.
- Red and gold never carry meaning alone — always paired with text or position.
- Every interactive target is ≥44px. Every input has a real `<label>` (visually hidden where the
  design shows placeholder-only fields).
- Skip link, visible gold focus rings, `prefers-reduced-motion` honoured.

## Before launch

1. **Have counsel review `/privacy` and `/terms`.** They are complete drafts written against what
   the site actually does, not a substitute for legal review.
2. Replace every image slot with real art.
3. Have JROC edit the pillar-page copy and the seven Field Notes drafts.
4. Point the social links in `lib/content/site.ts` at the real accounts.
5. Confirm the `from` address in `RESEND_FROM_EMAIL` on a verified domain.
