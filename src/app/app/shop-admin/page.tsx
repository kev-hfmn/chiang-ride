import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus, Settings, Store, Users, Bike, Clock, ChevronRight } from 'lucide-react'
import { getAdminShop } from '@/lib/db/admin'
import { getTranslations } from '@/lib/i18n/server'
import { LanguageToggle } from '@/components/language-toggle'

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
  let recentBookings: any[] = []

  if (shop) {
    // Total Scooters
    const { count: scooterCount } = await supabase
      .from('scooters')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
    
    // Active Bookings
    const { count: activeCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .eq('status', 'active')

    // Pending Requests
    const { count: pendingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .in('status', ['pending', 'requested'])

    stats = {
      totalScooters: scooterCount || 0,
      activeBookings: activeCount || 0,
      pendingRequests: pendingCount || 0
    }

    // Recent Bookings (Limit 5)
    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        *,
        scooters (model, brand)
      `)
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    recentBookings = bookings || []
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">{t('partnerDashboard')}</h1>
           <p className="text-sm text-gray-500">{t('welcomeBack')}, {shop?.name || 'Partner'}.</p>
        </div>
        <div className="flex gap-2 items-center">
            <LanguageToggle />
            <Link href="/app/shop-admin/settings" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
              <Settings className="w-5 h-5" />
              {t('settings')}
            </Link>
            <Link href="/app/shop-admin/inventory/new" className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 shadow-sm shadow-orange-200 transition-all">
              <Plus className="w-5 h-5" />
              {t('addBike')}
            </Link>
        </div>
      </div>

      {!shop && (
         <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm flex gap-3 items-start">
            <span className="text-xl">👋</span>
            <div>
                <p className="font-bold">{t('demoModeActive')}</p>
                <p>{t('demoModeMessage')}</p>
            </div>
         </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('fleet')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.totalScooters}</div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-green-600 mb-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('activeBookings')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.activeBookings}</div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{t('pendingRequests')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stats.pendingRequests}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{t('recentActivity')}</h3>
            <Link href="/app/shop-admin/bookings" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center">
                {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
        <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">{t('noRecentBookings')}</div>
            ) : (
                recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${booking.status === 'active' ? 'bg-green-500' : booking.status === 'requested' || booking.status === 'pending' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                            <div>
                                <div className="text-sm font-bold text-gray-900">{booking.customer_name || t('guest')}</div>
                                <div className="text-xs text-gray-500">{booking.scooters?.model} • {booking.total_days} {t('days')}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{booking.total_price}฿</div>
                            <div className="text-[10px] font-medium uppercase text-gray-400">{booking.status}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}
