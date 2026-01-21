'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export function LanguageToggleCompact() {
  const { language, setLanguage } = useLanguage()

  const isThaiSelected = language === 'th'

  return (
    <button
      onClick={() => setLanguage(isThaiSelected ? 'en' : 'th')}
      className="flex items-center gap-0 bg-gray-200 rounded-full p-1 shadow-inner"
    >
      <span
        className={`text-2xl px-3 py-1 rounded-full transition-all duration-200 ${
          !isThaiSelected
            ? 'bg-white shadow-lg scale-110'
            : 'opacity-80 hover:opacity-75'
        }`}
      >
        🇬🇧
      </span>
      <span
        className={`text-2xl px-3 py-1 rounded-full transition-all duration-200 ${
          isThaiSelected
            ? 'bg-white shadow-lg scale-110'
            : 'opacity-80 hover:opacity-75'
        }`}
      >
        🇹🇭
      </span>
    </button>
  )
}
