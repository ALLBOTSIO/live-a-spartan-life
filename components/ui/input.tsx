import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * shadcn/ui Input, restyled to the brand.
 * Charcoal fill, #33383B hairline border, zero radius, 44px minimum height.
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'min-h-[44px] w-full border border-input-border bg-charcoal px-[18px] py-4 font-sans text-[15px] text-bone outline-none transition-colors duration-150',
        'placeholder:text-iron focus-visible:border-steel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        'aria-invalid:border-red',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
