'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

const ShopMap = dynamic(() => import('@/components/shop-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-300" />
    </div>
  ),
})

interface Shop {
  id: string
  name: string
  address?: string
  city: string
  latitude?: number
  longitude?: number
  is_verified: boolean
}

interface ShopMapWrapperProps {
  shops: Shop[]
}

export default function ShopMapWrapper({ shops }: ShopMapWrapperProps) {
  return <ShopMap shops={shops} />
}
