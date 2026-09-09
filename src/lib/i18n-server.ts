import { cookies } from 'next/headers'

import { isLocale, type Locale } from './i18n'

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get('rana-locale')?.value
  return isLocale(value) ? value : 'en'
}
