'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot — real visitors never fill this hidden field in.
  if (formData.get('company')) {
    return { status: 'success' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !subject || !message) {
    return { status: 'error', message: 'Please fill in all required fields.' }
  }

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, phone: phone || undefined, subject, message },
      overrideAccess: false,
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', message: 'Something went wrong. Please try again shortly.' }
  }
}
