'use client'

import { useSyncExternalStore } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import { MapPin, ShieldCheck } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

interface Shop {
  id: string
  name: string
  address?: string
  city: string
  latitude?: number | null
  longitude?: number | null
  is_verified: boolean
}

interface ShopMapProps {
  shops: Shop[]
}

// Chiang Mai center coordinates
const CHIANG_MAI_CENTER: [number, number] = [18.7883, 98.9853]

// Custom marker icon
const createMarkerIcon = (isVerified: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${isVerified ? '#16a34a' : '#6b7280'};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

// Hook to check if component is mounted (client-side)
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function ShopMap({ shops }: ShopMapProps) {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-300" />
      </div>
    )
  }

  // Filter shops that have coordinates
  const shopsWithCoords = shops.filter(shop => shop.latitude && shop.longitude)

  // Calculate center based on shops or default to Chiang Mai
  const center: [number, number] = shopsWithCoords.length > 0
    ? [
        shopsWithCoords.reduce((sum, s) => sum + (s.latitude || 0), 0) / shopsWithCoords.length,
        shopsWithCoords.reduce((sum, s) => sum + (s.longitude || 0), 0) / shopsWithCoords.length,
      ]
    : CHIANG_MAI_CENTER

  return (
    <div className="h-[300px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shopsWithCoords.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.latitude!, shop.longitude!]}
            icon={createMarkerIcon(shop.is_verified)}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{shop.name}</h3>
                  {shop.is_verified && (
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {shop.address || shop.city}
                </p>
                <Link
                  href={`/app/shops/${shop.id}`}
                  className="block text-center bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Shop
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
