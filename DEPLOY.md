# Deploy Runbook — Live a Spartan Life

Target repo: `https://github.com/ALLBOTSIO/live-a-spartan-life`

The repo is already initialised locally with one commit on `main` and `origin` pointed at that URL.
Run these in order. Total time from here to a live URL: about 25 minutes.

---

## 1. Push to GitHub

```bash
cd live-a-spartan-life
git remote -v                 # confirm origin = ALLBOTSIO/live-a-spartan-life
git push -u origin main
```

If the repo does not exist yet:

```bash
gh repo create ALLBOTSIO/live-a-spartan-life --private --source=. --remote=origin --push
```

**Verify:** the GitHub repo shows 88 files and the commit "Initial build: Live a Spartan Life".

---

## 2. Supabase

### 2a. Create the project

Dashboard → New project, in the **AI Venture Holdings** org.

- Name: `live-a-spartan-life`
- Region: pick the one closest to the audience (US West for a Utah-based build)
- Save the database password somewhere permanent — it is shown once

### 2b. Run the migration

Either paste `supabase/migrations/0001_init.sql` into the SQL editor and run it, or:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

### 2c. Collect the keys

Project Settings → API:

| Value | Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` |

> The `service_role` key bypasses RLS. It is server-only. Never prefix it `NEXT_PUBLIC_`, never
> paste it into client code.

### 2d. Auth settings

Authentication → URL Configuration:

- Site URL: `https://liveaspartanlife.com`
- Redirect URLs: add `https://liveaspartanlife.com/auth/callback` and
  `http://localhost:3000/auth/callback`

**Verify:** Table editor shows `subscribers` and `profiles`. `subscribers` shows RLS enabled with
zero policies — that is correct, not a mistake.

---

## 3. Stripe

### 3a. Product and price

Products → Add product:

- Name: `The Brotherhood`
- Price: `$24.00` USD, **recurring, monthly**
- Copy the price ID (`price_...`) → `STRIPE_BROTHERHOOD_PRICE_ID`

### 3b. API key

Developers → API keys → Secret key → `STRIPE_SECRET_KEY`

Use **test mode** keys until you have run a full test purchase, then swap to live.

### 3c. Webhook

Developers → Webhooks → Add endpoint:

- URL: `https://liveaspartanlife.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the signing secret (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

Local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Verify:** a test checkout with card `4242 4242 4242 4242` flips `profiles.subscription_status`
to `active` and `/account` shows the member view.

---

## 4. Resend

1. Add and verify the sending domain `liveaspartanlife.com` (DNS records: SPF, DKIM, and the
   return-path CNAME).
2. API Keys → create one → `RESEND_API_KEY`
3. `RESEND_FROM_EMAIL` = `JROC <jroc@liveaspartanlife.com>` — must be on the verified domain.

**Verify:** submit the form on `/start` with a real address; the Day 01 email arrives and does not
land in spam.

---

## 5. PostHog

1. Create project `liveaspartanlife` → Project API key → `NEXT_PUBLIC_POSTHOG_KEY`
2. `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com` (or `https://eu.i.posthog.com`)

Events already instrumented: `$pageview`, `starter_signup`, `newsletter_signup`,
`brotherhood_checkout_started`, `field_notes_filtered`.

**Verify:** PostHog Live events shows a `$pageview` within seconds of loading the site.

---

## 6. Vercel

### 6a. Import

Vercel → Add New → Project → import `ALLBOTSIO/live-a-spartan-life`.

Framework preset: **Next.js**. Leave build and output settings on the defaults — everything is
standard.

### 6b. Environment variables

Add all of these to **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SITE_URL=https://liveaspartanlife.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_BROTHERHOOD_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=JROC <jroc@liveaspartanlife.com>
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_FEATURE_SCANLINE=true
```

Set `NEXT_PUBLIC_SITE_URL` per environment — the preview value should be the preview URL, or Stripe
redirects and canonical tags will point at production from a preview build.

Or from the CLI:

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ...repeat per variable, or:
vercel env pull .env.local   # to sync down once they are set
```

### 6c. Domain

Project Settings → Domains → add `liveaspartanlife.com` and `www.liveaspartanlife.com`
(redirect www → apex). Point DNS at Vercel per the records it shows.

### 6d. Deploy

```bash
vercel --prod
```

or just push to `main` — Vercel builds on push once the project is linked.

---

## 7. Post-deploy checklist

- [ ] `https://liveaspartanlife.com` loads, all 14 routes render
- [ ] `/start` form writes a row to `subscribers` and sends the Day 01 email
- [ ] `/field-notes` filter updates the URL and the grid
- [ ] `/brotherhood` CTA opens Stripe Checkout at $24/mo
- [ ] Test purchase flips `profiles.subscription_status` to `active`
- [ ] `/account` redirects to `/login` when signed out, shows the member view when signed in
- [ ] Magic link email arrives and signs you in
- [ ] `/sitemap.xml` and `/robots.txt` return the production domain, not localhost
- [ ] OG card renders correctly (test in the LinkedIn Post Inspector or X card validator)
- [ ] PostHog shows pageviews and a `starter_signup` event
- [ ] Lighthouse on `/` scores 95+ on performance and 100 on accessibility

---

## 8. Before you point the domain at it

1. **`/privacy` and `/terms` reviewed by counsel.** They are complete drafts written against what
   the site actually does, not a substitute for legal review.
2. Real photography in every image slot.
3. JROC's edits to the pillar-page copy and the seven Field Notes drafts.
4. Real social URLs in `lib/content/site.ts`.
5. Stripe switched from test keys to live keys, and the webhook re-created in live mode with a new
   signing secret.
