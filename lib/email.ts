import 'server-only'

import { Resend } from 'resend'

import { env, isResendConfigured } from '@/lib/env'

/**
 * Transactional email.
 *
 * Templates are plain HTML strings on the brand palette — Anton is not
 * web-safe in email clients, so headlines fall back to a bold system stack
 * rather than rendering as a broken serif.
 */

let client: Resend | null = null

function getClient() {
  if (!isResendConfigured) return null
  if (!client) client = new Resend(env.RESEND_API_KEY)
  return client
}

const shell = (body: string) => `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0B0C0C;color:#E9E5DC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B0C0C;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#16191B;border:1px solid #24282A;">
            <tr>
              <td style="padding:32px 32px 0;">
                <div style="font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#E9E5DC;font-weight:700;">
                  <span style="color:#B22222;">&#9670;</span>&nbsp; LIVE A SPARTAN LIFE
                </div>
              </td>
            </tr>
            <tr><td style="padding:24px 32px 32px;">${body}</td></tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #24282A;">
                <p style="margin:0;font-size:11px;line-height:1.7;letter-spacing:0.06em;color:#62686C;">
                  You are getting this because you asked for it at liveaspartanlife.com.
                  <a href="${env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color:#9DA3A6;">Unsubscribe</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

const h1 = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.1;letter-spacing:0.01em;text-transform:uppercase;color:#E9E5DC;font-weight:800;">${text}</h1>`

const p = (text: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#9DA3A6;">${text}</p>`

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#B22222;color:#E9E5DC;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:16px 28px;">${label}</a>`

type SendResult = { sent: boolean; reason?: string }

export async function sendStarterWelcome({
  email,
  firstName,
}: {
  email: string
  firstName?: string
}): Promise<SendResult> {
  const resend = getClient()
  if (!resend) return { sent: false, reason: 'resend-not-configured' }

  const greeting = firstName ? `${firstName} —` : 'Welcome —'

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'The Spartan Starter — Day 01',
    html: shell(`
      ${h1('Seven days. One clear reset.')}
      ${p(`${greeting} you are in. The Starter is a practical 7-day reset built around the five pillars. No extreme rules, no hype.`)}
      ${p('<strong style="color:#E9E5DC;">Day 01 — Stand Up.</strong> Pick one daily movement standard you can keep this week without negotiating. Ten minutes counts. The point is that you do not renegotiate it tomorrow.')}
      ${p('The rest of the week arrives one day at a time. Read it, run it, and keep what works.')}
      <div style="margin:24px 0 8px;">${button(`${env.NEXT_PUBLIC_SITE_URL}/code`, 'Read the Code')}</div>
    `),
  })

  if (error) {
    console.error('[resend] starter welcome failed', { message: error.message })
    return { sent: false, reason: error.message }
  }
  return { sent: true }
}

export async function sendNewsletterWelcome({ email }: { email: string }): Promise<SendResult> {
  const resend = getClient()
  if (!resend) return { sent: false, reason: 'resend-not-configured' }

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Field Notes — you’re subscribed',
    html: shell(`
      ${h1('Field notes, delivered.')}
      ${p('One useful note a week. Training, fuel, mind, money, brotherhood. No noise.')}
      ${p('If you have not run the 7-day reset yet, start there — it is free and it is the fastest way to get moving again.')}
      <div style="margin:24px 0 8px;">${button(`${env.NEXT_PUBLIC_SITE_URL}/start`, 'Get the Starter')}</div>
    `),
  })

  if (error) {
    console.error('[resend] newsletter welcome failed', { message: error.message })
    return { sent: false, reason: error.message }
  }
  return { sent: true }
}

export async function sendBrotherhoodWelcome({
  email,
  firstName,
}: {
  email: string
  firstName?: string | null
}): Promise<SendResult> {
  const resend = getClient()
  if (!resend) return { sent: false, reason: 'resend-not-configured' }

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'You’re in the Brotherhood',
    html: shell(`
      ${h1('Do not build alone.')}
      ${p(`${firstName ? `${firstName} —` : 'Welcome —'} your membership is active. The first thing to do is the only thing that matters: state one standard you are holding this week.`)}
      ${p('Weekly accountability, the training and reset library, and the rooms are all open to you now.')}
      <div style="margin:24px 0 8px;">${button(`${env.NEXT_PUBLIC_SITE_URL}/account`, 'Open the Member Area')}</div>
    `),
  })

  if (error) {
    console.error('[resend] brotherhood welcome failed', { message: error.message })
    return { sent: false, reason: error.message }
  }
  return { sent: true }
}
