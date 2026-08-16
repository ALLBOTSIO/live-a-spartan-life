/**
 * The five-pillar code.
 *
 * The five names and one-line definitions are final brand copy from the handoff.
 * The pillar detail pages (`standards`, `intro`, `start`) were not in the design
 * bundle — they follow the established system and are drafted from the brand
 * brief. Treat that longer copy as a first draft for JROC to edit.
 */

export type PillarSlug = 'train' | 'fuel' | 'mind' | 'provide' | 'brotherhood'

export type Pillar = {
  num: string
  slug: PillarSlug
  name: string
  /** One-line definition. Final copy — used on the homepage cards. */
  def: string
  /** Field Notes category tag. */
  category: string
  href: string
  intro: string
  standards: { label: string; text: string }[]
  start: string
}

export const pillars: Pillar[] = [
  {
    num: '01',
    slug: 'train',
    name: 'TRAIN',
    def: 'Build a body that can carry your life.',
    category: 'TRAIN',
    href: '/train',
    intro:
      'Training is not a hobby and it is not vanity. It is the maintenance schedule on the only body you get. The standard is a body that can carry your work, your family, and a bad day without folding.',
    standards: [
      {
        label: 'Move every day',
        text: 'A repeatable daily minimum you can hit in a bad week, not a perfect one. Consistency beats intensity over a decade.',
      },
      {
        label: 'Train strength twice a week',
        text: 'Push, pull, hinge, squat, carry. Load that respects your joints and still asks something of you.',
      },
      {
        label: 'Build a base you can walk on',
        text: 'Rucking, hills, and long easy work. Conditioning that shows up in real life, not just on a screen.',
      },
      {
        label: 'Protect the recovery',
        text: 'Sleep is training. Deload weeks are training. Injuries you train through become injuries you live with.',
      },
    ],
    start:
      'Pick one daily movement standard you can keep this week without negotiating. Repeat it seven times before you add anything.',
  },
  {
    num: '02',
    slug: 'fuel',
    name: 'FUEL',
    def: 'Eat and recover like your future depends on it.',
    category: 'FUEL',
    href: '/fuel',
    intro:
      'No supplement fixes a diet built on convenience. Fuel is the boring set of rules you keep on the days nobody is watching — and the recovery that lets the training count.',
    standards: [
      {
        label: 'Protein first',
        text: 'Anchor every meal to a protein source before anything else joins the plate.',
      },
      {
        label: 'Whole food by default',
        text: 'If it needs a marketing claim to sound healthy, it is not the default. Keep the exceptions honest and occasional.',
      },
      {
        label: 'Water before caffeine',
        text: 'Hydrate first. Caffeine is a tool, not a foundation, and it should not be covering for four hours of sleep.',
      },
      {
        label: 'Sleep on a schedule',
        text: 'A consistent window beats a long weekend catch-up. Recovery is where the work actually lands.',
      },
    ],
    start:
      'Run protein-first for seven days. Change nothing else. Notice what happens to your afternoon.',
  },
  {
    num: '03',
    slug: 'mind',
    name: 'MIND',
    def: 'Develop the steadiness to handle hard seasons.',
    category: 'MIND',
    href: '/mind',
    intro:
      'Hard seasons do not ask permission. Steadiness is not a personality trait you were born with or without — it is a set of practices that keep you useful while things are difficult.',
    standards: [
      {
        label: 'Take an honest inventory',
        text: 'Write down where the drift actually started. Vague problems stay unsolved because they stay vague.',
      },
      {
        label: 'Cut the intake that runs you',
        text: 'Most men are not undisciplined. They are over-stimulated. Reduce the input before adding more willpower.',
      },
      {
        label: 'Keep one hard promise a day',
        text: 'Small kept promises rebuild self-trust faster than any large one you break.',
      },
      {
        label: 'Ask for help early',
        text: 'Asking is a load-bearing skill. If it is heavy enough to change how you treat people, it is heavy enough to say out loud.',
      },
    ],
    start:
      'Spend twenty minutes writing the honest inventory. No audience, no editing. Then pick the one thing you will stop doing this week.',
  },
  {
    num: '04',
    slug: 'provide',
    name: 'PROVIDE',
    def: 'Lead your work, money, and responsibilities with discipline.',
    category: 'PROVIDE',
    href: '/provide',
    intro:
      'Providing is broader than a paycheck. It is the discipline you bring to work, money, and the responsibilities other people are counting on you to carry without being reminded.',
    standards: [
      {
        label: 'Run a weekly money review',
        text: 'Thirty minutes, same time every week. What came in, what went out, what is due. Avoidance costs more than the numbers do.',
      },
      {
        label: 'Do the work you said you would',
        text: 'Your reputation is the sum of the things you finish. Finish fewer things and finish them properly.',
      },
      {
        label: 'Build one margin',
        text: 'Cash, skills, or time — pick the one you are thinnest on and thicken it. Margin is what turns a crisis into an inconvenience.',
      },
      {
        label: 'Lead where you already are',
        text: 'Your household, your team, your crew. Leadership is not a title you wait to be given.',
      },
    ],
    start:
      'Book the weekly money review on your calendar for the next four weeks. Keep the first one short enough that you keep the second.',
  },
  {
    num: '05',
    slug: 'brotherhood',
    name: 'BROTHERHOOD',
    def: 'Find men who expect more from you—and stand beside you.',
    category: 'BROTHERHOOD',
    href: '/brotherhood',
    intro:
      'Isolation is the most common condition among men who are struggling, and the least discussed. Brotherhood is not a group chat. It is a small number of men who know what you are working on and will ask about it.',
    standards: [
      {
        label: 'Have one real conversation a week',
        text: 'Not logistics. Not sports. What you are actually carrying and what you are actually doing about it.',
      },
      {
        label: 'Be the man who asks',
        text: 'Most men are waiting for someone else to go first. Go first.',
      },
      {
        label: 'Keep other men’s stories in the room',
        text: 'Confidence is the price of admission. Break it once and the room is finished.',
      },
      {
        label: 'Expect more, not less',
        text: 'Friends who only agree with you are company. Brothers hold a standard and stay anyway.',
      },
    ],
    start:
      'Call one man you respect this week. Tell him one true thing about where you are. That is the whole assignment.',
  },
]

export const pillarBySlug = (slug: string) => pillars.find((p) => p.slug === slug)

/** The four pillar detail routes. Brotherhood has its own sales page. */
export const pillarRoutes = pillars.filter((p) => p.slug !== 'brotherhood')

/** Field Notes filter categories. ALL first, then the five pillars. */
export const categories = ['ALL', ...pillars.map((p) => p.category)] as const
export type Category = (typeof categories)[number]
