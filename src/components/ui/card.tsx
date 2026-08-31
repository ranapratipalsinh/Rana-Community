import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden border border-gold/20 bg-ink-card shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/40 hover:shadow-elevated',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardImage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative aspect-[4/3] w-full bg-ink-soft', className)} {...props} />
  ),
)
CardImage.displayName = 'CardImage'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-heading text-lg font-semibold tracking-wide text-gold', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('mt-2 text-sm text-gold/70', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

export { Card, CardImage, CardContent, CardTitle, CardDescription }
