'use client'

import { useLanguage } from '@/lib/i18n/language-context'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
      <Globe className="w-4 h-4 text-gray-500" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-all ${
          language === 'en'
            ? 'bg-green-600 text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('th')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-all ${
          language === 'th'
            ? 'bg-green-600 text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        ไทย
      </button>
    </div>
  )
}
