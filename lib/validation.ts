import { z } from 'zod'

/** Shared between the client forms and the route handlers. Validate on both sides. */

export const starterSignupSchema = z.object({
  firstName: z.string().trim().max(80, 'That name is too long.').optional().or(z.literal('')),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .max(254, 'That email address is too long.')
    .email('Enter a valid email address.'),
  /** Honeypot. Real men do not fill in hidden fields; bots do. */
  company: z.string().max(0).optional(),
})

export const newsletterSignupSchema = starterSignupSchema.pick({ email: true, company: true })

export type StarterSignup = z.infer<typeof starterSignupSchema>
export type NewsletterSignup = z.infer<typeof newsletterSignupSchema>

export type SignupSource = 'homepage' | 'start-page' | 'field-notes' | 'article'
