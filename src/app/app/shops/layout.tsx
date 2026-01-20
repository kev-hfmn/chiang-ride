import { LanguageProvider } from '@/lib/i18n/language-context'

export default function ShopsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
