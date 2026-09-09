import { getPayload } from 'payload'

import config from '@/payload.config'
import { getLocale } from '@/lib/i18n-server'

export async function getPayloadClient() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = await getLocale()

  // Public pages already share this client helper. Inject the selected locale
  // here so every existing CMS query returns the active translation.
  return new Proxy(payload, {
    get(target, property, receiver) {
      if (property === 'find' || property === 'findGlobal') {
        const method = Reflect.get(target, property, receiver) as (args: Record<string, unknown>) => unknown
        return (args: Record<string, unknown>) => method.call(target, { ...args, locale: args.locale ?? locale })
      }
      return Reflect.get(target, property, receiver)
    },
  })
}
