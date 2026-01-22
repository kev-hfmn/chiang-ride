import { getAdminShop, getAdminInventory, getAdminBookings } from '@/lib/db/admin'
import { Card, CardContent } from '@/components/ui/card'
import { getTranslations } from '@/lib/i18n/server'
import { CalendarPageClient } from '@/components/calendar-page-client'

export default async function CalendarPage() {
  const shop = await getAdminShop()
  const { t } = await getTranslations()

  if (!shop) return null

  const scooters = await getAdminInventory(shop.id)
  const bookings = await getAdminBookings(shop.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">{t('calendarAvailability')}</h1>
          <p className="text-gray-500 text-sm">{t('calendarSubtitle')}</p>
        </div>
        <div className="shrink-0">
          <CalendarPageClient 
            scooters={scooters}
            bookings={bookings}
            headerOnly
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <CalendarPageClient 
            scooters={scooters}
            bookings={bookings}
          />
        </CardContent>
      </Card>
    </div>
  )
}
