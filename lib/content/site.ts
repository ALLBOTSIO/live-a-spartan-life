/**
 * Static site copy and navigation.
 *
 * Everything here is lifted verbatim from the design references. Copy is final
 * per the handoff — change it only on the client's instruction.
 */

export const site = {
  name: 'Live a Spartan Life',
  shortName: 'LSL',
  tagline: 'Build strength. Lead with purpose. Become harder to break.',
  description:
    'A modern code for men who are done drifting and ready to build a stronger body, steadier mind, deeper brotherhood, and more capable life.',
  founder: 'Jason "JROC" Craig',
  quote: 'Built for men choosing responsibility over excuses.',
  brotherhoodPrice: 24,
} as const

export type NavItem = { label: string; href: string }

/**
 * Desktop header nav. Order is fixed.
 *
 * Eight items, matching `Homepage.dc.html`. "Start Here" is carried by the
 * persistent red CTA and "Gear" lives in the footer — adding either here
 * overflows the 1280px bar and breaks the single-line rule.
 */
export const primaryNav: NavItem[] = [
  { label: 'The Code', href: '/code' },
  { label: 'Train', href: '/train' },
  { label: 'Fuel', href: '/fuel' },
  { label: 'Mind', href: '/mind' },
  { label: 'Provide', href: '/provide' },
  { label: 'Brotherhood', href: '/brotherhood' },
  { label: 'Field Notes', href: '/field-notes' },
  { label: 'About', href: '/about' },
]

/** Mobile field-manual index. Numbered 01–08, per the mobile design. */
export const indexNav: (NavItem & { num: string })[] = [
  { num: '01', label: 'The Code', href: '/code' },
  { num: '02', label: 'Train', href: '/train' },
  { num: '03', label: 'Fuel', href: '/fuel' },
  { num: '04', label: 'Mind', href: '/mind' },
  { num: '05', label: 'Provide', href: '/provide' },
  { num: '06', label: 'Brotherhood', href: '/brotherhood' },
  { num: '07', label: 'Field Notes', href: '/field-notes' },
  { num: '08', label: 'Start Here', href: '/start' },
]

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'The Code',
    items: [
      { label: 'Train', href: '/train' },
      { label: 'Fuel', href: '/fuel' },
      { label: 'Mind', href: '/mind' },
      { label: 'Provide', href: '/provide' },
      { label: 'Brotherhood', href: '/brotherhood' },
    ],
  },
  {
    heading: 'Explore',
    items: [
      { label: 'Field Notes', href: '/field-notes' },
      { label: 'Gear', href: '/gear' },
      { label: 'About', href: '/about' },
      { label: 'Start Here', href: '/start' },
    ],
  },
  {
    heading: 'Follow',
    items: [
      { label: 'Instagram', href: 'https://instagram.com/liveaspartanlife' },
      { label: 'YouTube', href: 'https://youtube.com/@liveaspartanlife' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/liveaspartanlife' },
    ],
  },
]
