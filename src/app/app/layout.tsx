import Link from 'next/link'
import AppShell from './app-shell'
import { LanguageProvider } from '@/lib/i18n/language-context'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <AppShell>
        {children}
      </AppShell>
    </LanguageProvider>
  )
}
