'use client'

import Link from 'next/link';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';

import { ScooterImage } from '../scooter-image';
import type { ScooterWithShop } from './types';

interface ScooterCardProps {
  scooter: ScooterWithShop;
  availableToday?: boolean;
}

export function ScooterCard({ scooter, availableToday }: ScooterCardProps) {
  return (
    <Link href={`/scooters/${scooter.id}`} className="block group">
      {/* Airbnb-style: image with rounded corners, no card border */}
      <div className="aspect-4/3 bg-gray-100 relative overflow-hidden rounded-2xl">
        <ScooterImage
          brand={scooter.brand}
          model={scooter.model}
          scooterId={scooter.id}
          imageUrl={scooter.image_url}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />


        {/* Availability badge */}
        {availableToday !== undefined && (
          <div className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm shadow-md ${
            availableToday 
              ? 'bg-green-500/40 text-white' 
              : 'bg-red-500/40 text-white'
          }`}>
            {availableToday ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Available</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Booked</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content below image */}
      <div className="pt-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">
            {scooter.brand} {scooter.model}
          </h3>
          <span className="text-xs text-gray-500 rounded shrink-0">
            {scooter.engine_cc}cc
          </span>

        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {scooter.shops?.name || scooter.shops?.city || 'Chiang Mai'}
          </span>
        </p>
        
        {/* Pricing - Daily rate only */}
        <div className="pt-0">
          <div className="text-sm font-semibold text-gray-900">
            {scooter.daily_price}฿ <span className="text-xs font-normal text-gray-500">/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
