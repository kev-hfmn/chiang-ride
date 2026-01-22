'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, ShieldCheck, Fuel, Gauge } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

import { AvailabilityGrid } from './availability-grid'
import BookingForm from './booking-form'
import { ScooterImage } from './scooter-image'

interface Shop {
  id: string
  name: string
  address?: string
  city?: string
  is_verified?: boolean
  deposit_policy_text?: string
}

interface Scooter {
  id: string
  shop_id: string
  model: string
  brand: string
  engine_cc: number
  daily_price: number
  weekly_price?: number
  monthly_price?: number
  deposit_amount: number
  is_active: boolean
  image_url?: string
  shops?: Shop
}

interface Availability {
  id: string
  scooter_id: string
  day: string
  is_available: boolean
}

interface ScooterDetailViewProps {
  scooter: Scooter
  availability: Availability[]
}

export function ScooterDetailView({ scooter, availability }: ScooterDetailViewProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const shop = scooter.shops

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Scooter Image */}
      <div className="bg-gray-100 rounded-3xl aspect-video flex items-center justify-center overflow-hidden">
        <ScooterImage
          brand={scooter.brand}
          model={scooter.model}
          scooterId={scooter.id}
          imageUrl={scooter.image_url}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Scooter Info */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{scooter.model}</h1>
            <p className="text-gray-500 font-medium">{scooter.brand}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-green-600">{scooter.daily_price}฿</div>
            <div className="text-xs text-gray-400 font-bold uppercase">{t('perDay')}</div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex gap-4 py-3 border-y border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="font-bold">{scooter.engine_cc}cc</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="font-bold">{t('automatic')}</span>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {t('rentalRates')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-green-700">{scooter.daily_price}฿</div>
              <div className="text-xs text-green-600 font-medium">{t('daily')}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-gray-700">
                {scooter.weekly_price || Math.round(scooter.daily_price * 6)}฿
              </div>
              <div className="text-xs text-gray-500 font-medium">{t('weekly')}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-gray-700">
                {scooter.monthly_price || Math.round(scooter.daily_price * 22)}฿
              </div>
              <div className="text-xs text-gray-500 font-medium">{t('monthly')}</div>
            </div>
          </div>
        </div>

        {/* Deposit Info */}
        {scooter.deposit_amount > 0 && (
          <div className="bg-orange-50 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block text-sm">{t('depositRequired')}</span>
              <span className="text-sm text-gray-600">
                {scooter.deposit_amount}฿ {t('refundableDeposit')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Shop Info */}
      {shop && (
        <Link href={`/shops/${shop.id}`} className="block">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">{shop.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{shop.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {shop.address || shop.city}
                  </p>
                </div>
              </div>
              {shop.is_verified && (
                <div className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t('verified')}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Availability */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t('availability')}
        </h3>
        <AvailabilityGrid scooterId={scooter.id} initialAvailability={availability} />
        <p className="text-xs text-gray-400">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>{' '}
          {t('available')}
          <span className="inline-block w-2 h-2 bg-red-400 rounded-full ml-3 mr-1"></span>{' '}
          {t('unavailable')}
        </p>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t('bookThisScooter')}
        </h3>
        <BookingForm scooter={scooter} shopId={shop?.id || scooter.shop_id} />
      </div>
    </div>
  )
}
