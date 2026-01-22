'use client'

import { ScooterFilters } from './scooter-list/filters'
import { ScooterCard } from './scooter-list/scooter-card'
import { useScooterFilters } from './scooter-list/use-scooter-filters'
import type { ScooterWithShop } from './scooter-list/types'

interface ScooterListWithFiltersProps {
  scooters: ScooterWithShop[]
}

export function ScooterListWithFilters({ scooters }: ScooterListWithFiltersProps) {
  const {
    availableBrands,
    filteredScooters,
    selectedBrands,
    selectedPrice,
    selectedEngine,
    setSelectedPrice,
    setSelectedEngine,
    toggleBrand,
    clearFilters,
  } = useScooterFilters(scooters)

  return (
    <div className="space-y-6">
      <ScooterFilters
        availableBrands={availableBrands}
        selectedBrands={selectedBrands}
        selectedPrice={selectedPrice}
        selectedEngine={selectedEngine}
        filteredCount={filteredScooters.length}
        totalCount={scooters.length}
        onToggleBrand={toggleBrand}
        onSelectPrice={setSelectedPrice}
        onSelectEngine={setSelectedEngine}
        onClear={clearFilters}
      />

      {/* Scooter Grid - Two columns on mobile */}
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
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
          {filteredScooters.map((scooter) => (
            <ScooterCard key={scooter.id} scooter={scooter} />
          ))}
        </div>
      )}
    </div>
  )
}
