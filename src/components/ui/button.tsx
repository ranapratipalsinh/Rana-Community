import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap border font-heading uppercase tracking-[0.15em] transition-all duration-300 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'border-gold bg-gold text-ink hover:border-gold-light hover:bg-gold-light',
        outline:
          'border-gold bg-transparent text-gold hover:bg-gold hover:text-ink hover:shadow-gold-glow',
        ghost: 'border-transparent text-gold hover:bg-ink-soft',
      },
      size: {
        default: 'h-11 px-8 text-xs',
        sm: 'h-9 px-5 text-[0.65rem]',
        lg: 'h-13 px-10 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
