'use client'

import Link from 'next/link'
import { MapPin, ShieldCheck, Store } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

interface Shop {
  id: string
  name: string
  address?: string
  city?: string
  description?: string
  is_verified?: boolean
  location_lat?: number
  location_lng?: number
}

interface ShopsListViewProps {
  shops: Shop[]
}

export function ShopsListView({ shops }: ShopsListViewProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('exploreShops')}</h1>
          <p className="text-gray-500 text-sm">{t('findTrustedRentals')}</p>
        </div>
      </div>

      {/* Shop List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops?.map((shop) => (
          <Link
            key={shop.id}
            href={`/app/shops/${shop.id}`}
            className="block group bg-white border-none rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden ring-1 ring-gray-100"
          >
            <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-300 group-hover:from-green-100 group-hover:to-green-200 transition-colors relative">
              <Store className="w-16 h-16 opacity-50" />
              {shop.is_verified && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 fill-green-700 text-white" />
                  {t('verified')}
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                  {shop.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {shop.address || shop.city}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {shop.description || t('reliableScooterRentals')}
              </p>
            </div>
          </Link>
        ))}

        {(!shops || shops.length === 0) && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('noShopsFound')}</h3>
            <p className="text-gray-500">{t('beFirstToList')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
