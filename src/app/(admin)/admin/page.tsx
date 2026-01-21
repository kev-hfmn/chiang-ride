import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Bike, Clock, ChevronRight, Users } from 'lucide-react'
import { getAdminShop } from '@/lib/db/admin'
import { getTranslations } from '@/lib/i18n/server'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LanguageToggleCompact } from '@/components/language-toggle-compact'
import { Booking } from '@/lib/types/custom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ShopAdminPage() {
  const shop = await getAdminShop()
  const supabase = createAdminClient()
  const { t } = await getTranslations()

  // 1. Fetch KPI Data
  let stats = {
    totalScooters: 0,
    activeBookings: 0,
    pendingRequests: 0
  }
  let recentBookings: Booking[] = []

  if (shop) {
    // Parallelize all queries for faster loading (async-parallel)
    const [scooterResult, activeResult, pendingResult, bookingsResult] = await Promise.all([
      supabase
        .from('scooters')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shop.id),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shop.id)
        .eq('status', 'active'),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shop.id)
        .in('status', ['pending', 'requested']),
      supabase
        .from('bookings')
        .select(`
          *,
          scooters (model, brand)
        `)
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    stats = {
      totalScooters: scooterResult.count || 0,
      activeBookings: activeResult.count || 0,
      pendingRequests: pendingResult.count || 0
    }

    recentBookings = bookingsResult.data || []
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">{t('partnerDashboard')}</h1>
           <p className="text-sm text-gray-500">{t('welcomeBack')}, {shop?.name || 'Partner'}.</p>
        </div>
        <LanguageToggleCompact />
      </div>

      {!shop && (
         <Card className="bg-orange-50 border-orange-100">
            <CardContent className="p-4 flex gap-3 items-start">
              <span className="text-xl">👋</span>
              <div>
                  <p className="font-bold text-orange-800">{t('demoModeActive')}</p>
                  <p className="text-sm text-orange-700">{t('demoModeMessage')}</p>
              </div>
            </CardContent>
         </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('fleet')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.totalScooters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 text-green-600 mb-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('activeBookings')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.activeBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('pendingRequests')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex-row items-center justify-between border-b border-gray-50 pb-4">
            <CardTitle>{t('recentActivity')}</CardTitle>
            <Link href="/admin/bookings" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center">
                {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </Link>
        </CardHeader>
        <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">{t('noRecentBookings')}</div>
            ) : (
                recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-sm font-bold text-gray-900">{booking.customer_name || t('guest')}</div>
                                <div className="text-xs text-gray-500">{booking.scooters?.model} • {booking.total_days} {t('days')}</div>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <div className="text-sm font-bold text-gray-900">{booking.total_price}฿</div>
                            <StatusBadge status={booking.status} size="sm" showDot={false} />
                        </div>
                    </div>
                ))
            )}
        </div>
      </Card>
    </div>
  )
}
