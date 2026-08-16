import { Container, Heading, Section, SectionLabel } from '@/components/site/section'

const shifts = [
  { from: 'Drifting', to: 'Training' },
  { from: 'Reacting', to: 'Leading' },
  { from: 'Isolated', to: 'Connected' },
  { from: 'Excuses', to: 'Ownership' },
] as const

/** 02 / THE SHIFT */
export function Shift() {
  return (
    <Section aria-labelledby="shift-heading">
      <Container className="grid items-start gap-10 py-12 md:gap-20 md:py-[110px] lg:grid-cols-2">
        <div>
          <SectionLabel className="mb-[18px] md:mb-6">02 / The Shift</SectionLabel>
          <Heading id="shift-heading" className="m-0 mb-6 text-bone">
            You do not need more motivation. You need a code.
          </Heading>
          <p className="m-0 max-w-[480px] text-[15px] leading-[1.7] text-steel md:text-[16px]">
            Scattered. Tired. Running on caffeine and obligation. Most men aren’t weak — they’re
            reactive, isolated, and living without a standard. A code replaces the noise with a few
            clear commitments you keep whether you feel like it or not.
          </p>
        </div>

        <ul className="m-0 flex list-none flex-col border-t border-hairline p-0 lg:mt-[52px]">
          {shifts.map((shift) => (
            <li
              key={shift.from}
              className="grid grid-cols-[1fr_40px_1fr] items-center border-b border-hairline py-4 md:grid-cols-[1fr_60px_1fr] md:py-[22px]"
            >
              <span className="font-display text-[19px] tracking-[0.04em] text-iron uppercase line-through decoration-red decoration-2 md:text-[26px]">
                {shift.from}
              </span>
              <span className="text-center font-mono text-[12px] text-gold md:text-[14px]">
                <span aria-hidden="true">{'->'}</span>
                <span className="sr-only">becomes</span>
              </span>
              <span className="text-right font-display text-[19px] tracking-[0.04em] text-bone uppercase md:text-[26px]">
                {shift.to}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
