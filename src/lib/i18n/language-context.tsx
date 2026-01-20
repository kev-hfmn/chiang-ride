'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, TranslationKey } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'chiang-ride-language'
const COOKIE_NAME = 'chiang-ride-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Try cookie first, then localStorage
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? (match[2] as Language) : null
    }

    const cookieLang = getCookie(COOKIE_NAME)
    const stored = (cookieLang || localStorage.getItem(STORAGE_KEY)) as Language | null
    
    if (stored && (stored === 'en' || stored === 'th')) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    // Set cookie for server components (expires in 1 year)
    document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${365 * 24 * 60 * 60}`
    // Force a router refresh to update server components
    window.location.reload()
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
