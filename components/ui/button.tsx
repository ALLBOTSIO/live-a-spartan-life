import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * shadcn/ui Button, restyled to the brand.
 *
 * Hard corners, no shadows, mono uppercase labels. Red is the one signal per
 * viewport — use `outline` for anything secondary.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-mono uppercase transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
  {
    variants: {
      variant: {
        primary: 'bg-red text-bone hover:bg-red-hover',
        outline: 'border border-iron text-bone hover:border-bone',
        ghost: 'text-steel hover:text-bone',
        link: 'border-b border-gold pb-1 text-gold hover:text-bone',
      },
      size: {
        sm: 'px-[18px] py-[10px] text-[11px] tracking-[0.14em]',
        md: 'px-5 py-3 text-[11px] tracking-[0.14em]',
        lg: 'px-7 py-[18px] text-[13px] tracking-[0.12em]',
        xl: 'px-10 py-[22px] text-[14px] tracking-[0.14em]',
        block: 'w-full px-6 py-[18px] text-[13px] tracking-[0.14em]',
        inline: 'p-0 text-[12px] tracking-[0.14em]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), 'min-h-[44px]', className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
