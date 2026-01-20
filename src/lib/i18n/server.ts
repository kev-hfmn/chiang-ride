import { cookies } from 'next/headers'
import { Language, translations, TranslationKey } from './translations'

export const LANGUAGE_COOKIE = 'chiang-ride-language'

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const lang = cookieStore.get(LANGUAGE_COOKIE)?.value as Language
  return lang === 'en' || lang === 'th' ? lang : 'en'
}

export async function getTranslations() {
  const lang = await getLanguage()
  return {
    t: (key: TranslationKey) => translations[lang][key],
    lang
  }
}
