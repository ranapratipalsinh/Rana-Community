'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitContactForm, type ContactFormState } from '@/app/(frontend)/contact/actions'
import { Button } from '@/components/ui/button'

const initialState: ContactFormState = { status: 'idle' }

const inputClass =
  'mt-1 w-full border border-gold/30 bg-ink-card px-3 py-2 text-sm text-gold placeholder:text-gold/70 focus:border-gold focus:outline-none'
const labelClass = 'text-xs font-medium uppercase tracking-wide text-gold/70'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending…' : 'Send Message'}
    </Button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState)

  if (state.status === 'success') {
    return (
      <div className="border-2 border-gold bg-ink-card p-6 text-center">
        <p className="text-lg font-semibold uppercase tracking-wide text-gold">Thank you!</p>
        <p className="mt-2 text-sm text-gold/70">
          Your message has been received. We&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from real visitors via CSS, bots often fill every field. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input id="name" name="name" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject *
        </label>
        <input id="subject" name="subject" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>

      {state.status === 'error' ? <p className="text-sm text-danger">{state.message}</p> : null}

      <SubmitButton />
    </form>
  )
}
