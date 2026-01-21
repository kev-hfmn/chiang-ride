'use client'

import { Filter, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { ENGINE_SIZES, PRICE_RANGES } from './constants';

interface ScooterFiltersProps {
  availableBrands: string[];
  selectedBrands: string[];
  selectedPrice: string | null;
  selectedEngine: string | null;
  filteredCount: number;
  totalCount: number;
  onToggleBrand: (brand: string) => void;
  onSelectPrice: (priceId: string | null) => void;
  onSelectEngine: (engineId: string | null) => void;
  onClear: () => void;
}

export function ScooterFilters({
  availableBrands,
  selectedBrands,
  selectedPrice,
  selectedEngine,
  filteredCount,
  totalCount,
  onToggleBrand,
  onSelectPrice,
  onSelectEngine,
  onClear,
}: ScooterFiltersProps) {
  const activeFilterCount =
    selectedBrands.length + (selectedPrice ? 1 : 0) + (selectedEngine ? 1 : 0);

  return (
    <Card className="overflow-hidden">
      <Accordion type="single" collapsible defaultValue="filters">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4">
              {availableBrands.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
                    Brand
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => onToggleBrand(brand)}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
                    Daily Price
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => onSelectPrice(selectedPrice === range.id ? null : range.id)}
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

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 block">
                    Engine / Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ENGINE_SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => onSelectEngine(selectedEngine === size.id ? null : size.id)}
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

              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {filteredCount} of {totalCount} scooters
                  </span>
                  <button
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
