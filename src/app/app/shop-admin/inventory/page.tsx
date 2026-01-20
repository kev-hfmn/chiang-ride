import Link from 'next/link'
import { Plus, Settings, AlertCircle, Calendar } from 'lucide-react'
import { getAdminShop, getAdminInventory } from '@/lib/db/admin'
import { getScooterImage } from '@/lib/scooter-images'
import { getTranslations } from '@/lib/i18n/server'


export default async function InventoryPage() {
  const shop = await getAdminShop()
  const { t } = await getTranslations()
  
  if (!shop) {
    return (
      <div className="p-8 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
        <h2 className="text-xl font-bold text-gray-900">{t('shopNotFound')}</h2>
        <p>{t('contactSupport')}</p>
      </div>
    )
  }

  const scooters = await getAdminInventory(shop.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">{t('fleetInventory')}</h1>
           <p className="text-gray-500 text-sm">{t('manageInventory')}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            href="/app/shop-admin/calendar"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline">{t('availabilityLink')}</span>
          </Link>
          <Link
            href="/app/shop-admin/inventory/new"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('addScooter')}</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {scooters.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">{t('noScooters')}</p>
          </div>
        ) : (
          scooters.map((scooter) => (
            <div key={scooter.id} className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden">
                 <img
                   src={scooter.image_url || getScooterImage(scooter.brand, scooter.model, scooter.id)}
                   alt={`${scooter.brand} ${scooter.model}`}
                   className="w-full h-full object-cover"
                 />
                 {/* Status Dot */}
                 <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${scooter.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-gray-900 truncate">{scooter.brand} {scooter.model}</h3>
                   <span className="text-sm font-semibold text-gray-900">{scooter.daily_price}฿<span className="text-xs text-gray-500 font-normal">/day</span></span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{scooter.engine_cc}cc</span>
                  <span>{t('deposit')}: {scooter.deposit_amount}฿</span>
                </div>
              </div>

              <Link 
                href={`/app/shop-admin/inventory/${scooter.id}`}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
