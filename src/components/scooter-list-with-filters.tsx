'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'
import { getScooterImage } from '@/lib/scooter-images'

interface ScooterWithShop {
  id: string
  brand: string
  model: string
  engine_cc: number
  daily_price: number
  image_url?: string
  shops?: {
    id: string
    name: string
    address?: string
    city?: string
  }
}

interface ScooterListWithFiltersProps {
  scooters: ScooterWithShop[]
}

const ENGINE_SIZES = [
  { id: 'small', label: '50-125cc', description: 'Auto', min: 50, max: 125 },
  { id: 'medium', label: '125-200cc', description: 'Semi', min: 125, max: 200 },
  { id: 'large', label: '200cc+', description: 'Manual', min: 200, max: 9999 },
]

const PRICE_RANGES = [
  { id: 'budget', label: 'Under 200฿', min: 0, max: 200 },
  { id: 'mid', label: '200-400฿', min: 200, max: 400 },
  { id: 'premium', label: '400฿+', min: 400, max: 9999 },
]

export function ScooterListWithFilters({ scooters }: ScooterListWithFiltersProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null)

  const availableBrands = useMemo(() => {
    const brands = new Set(scooters.map(s => s.brand).filter(Boolean))
    return Array.from(brands).sort()
  }, [scooters])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const filteredScooters = useMemo(() => {
    return scooters.filter(scooter => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(scooter.brand)) {
        return false
      }

      // Price filter
      if (selectedPrice) {
        const priceRange = PRICE_RANGES.find(p => p.id === selectedPrice)
        if (priceRange && (scooter.daily_price < priceRange.min || scooter.daily_price > priceRange.max)) {
          return false
        }
      }

      // Engine size filter
      if (selectedEngine) {
        const engineSpec = ENGINE_SIZES.find(e => e.id === selectedEngine)
        if (engineSpec && (scooter.engine_cc < engineSpec.min || scooter.engine_cc > engineSpec.max)) {
          return false
        }
      }

      return true
    })
  }, [scooters, selectedBrands, selectedPrice, selectedEngine])

  const activeFilterCount =
    selectedBrands.length +
    (selectedPrice ? 1 : 0) +
    (selectedEngine ? 1 : 0)

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedPrice(null)
    setSelectedEngine(null)
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* Brand Filter */}
        {availableBrands.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
              Brand
            </label>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedBrands.includes(brand)
                      ? 'bg-green-600 text-white shadow-md shadow-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Engine Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
              Daily Price
            </label>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => setSelectedPrice(prev => prev === range.id ? null : range.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedPrice === range.id
                      ? 'bg-green-600 text-white shadow-md shadow-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Size Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
              Engine / Type
            </label>
            <div className="flex flex-wrap gap-2">
              {ENGINE_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedEngine(prev => prev === size.id ? null : size.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedEngine === size.id
                      ? 'bg-green-600 text-white shadow-md shadow-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {filteredScooters.length} of {scooters.length} scooters
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Scooter Grid */}
      {filteredScooters.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No scooters match your filters.</p>
          <button
            onClick={clearFilters}
            className="text-green-600 font-semibold mt-2 inline-block hover:text-green-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScooters.map((scooter) => (
            <Link
              key={scooter.id}
              href={`/app/scooters/${scooter.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all"
            >
              <div className="h-32 bg-gray-200 relative mb-2 overflow-hidden">
                <img
                  src={scooter.image_url || getScooterImage(scooter.brand, scooter.model, scooter.id)}
                  alt={`${scooter.brand} ${scooter.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{scooter.brand} {scooter.model}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {scooter.shops?.address || scooter.shops?.city || 'Chiang Mai'}
                  {scooter.shops?.name && ` • ${scooter.shops.name}`}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {scooter.engine_cc}cc
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-gray-900">{scooter.daily_price}฿</span>
                    <span className="text-xs text-gray-500">/day</span>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold group-hover:bg-green-700 transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
