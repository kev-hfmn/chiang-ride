import { useMemo, useState } from 'react';

import { ENGINE_SIZES, PRICE_RANGES } from './constants';
import type { ScooterWithShop } from './types';

export function useScooterFilters(scooters: ScooterWithShop[]) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const availableBrands = useMemo(() => {
    const brands = new Set(scooters.map((scooter) => scooter.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [scooters]);

  const filteredScooters = useMemo(() => {
    return scooters.filter((scooter) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(scooter.brand)) {
        return false;
      }

      if (selectedPrice) {
        const priceRange = PRICE_RANGES.find((range) => range.id === selectedPrice);
        if (priceRange && (scooter.daily_price < priceRange.min || scooter.daily_price > priceRange.max)) {
          return false;
        }
      }

      if (selectedEngine) {
        const engineSpec = ENGINE_SIZES.find((engine) => engine.id === selectedEngine);
        if (engineSpec && (scooter.engine_cc < engineSpec.min || scooter.engine_cc > engineSpec.max)) {
          return false;
        }
      }

      return true;
    });
  }, [scooters, selectedBrands, selectedPrice, selectedEngine]);

  const activeFilterCount =
    selectedBrands.length + (selectedPrice ? 1 : 0) + (selectedEngine ? 1 : 0);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice(null);
    setSelectedEngine(null);
  };

  return {
    availableBrands,
    filteredScooters,
    activeFilterCount,
    selectedBrands,
    selectedPrice,
    selectedEngine,
    setSelectedPrice,
    setSelectedEngine,
    toggleBrand,
    clearFilters,
  };
}
