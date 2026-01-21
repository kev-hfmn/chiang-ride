import AppShell from '@/components/app-shell'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppShell>
          {children}
        </AppShell>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
