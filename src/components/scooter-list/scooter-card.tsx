'use client'

import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { ScooterImage } from '../scooter-image';
import type { ScooterWithShop } from './types';

interface ScooterCardProps {
  scooter: ScooterWithShop;
}

export function ScooterCard({ scooter }: ScooterCardProps) {
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
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-green-700 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Available
        </div>
      </div>

      {/* Content below image */}
      <div className="pt-2.5 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {scooter.brand} {scooter.model}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
            {scooter.engine_cc}cc
          </span>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {scooter.shops?.name || scooter.shops?.city || 'Chiang Mai'}
          </span>
        </p>
        <p className="pt-1">
          <span className="font-semibold text-gray-900">{scooter.daily_price}฿</span>
          <span className="text-gray-500 text-sm"> /day</span>
        </p>
      </div>
    </Link>
  );
}
