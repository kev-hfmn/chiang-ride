'use client'

import { useState } from 'react'
import { getScooterImage } from '@/lib/scooter-images'

interface ScooterImageProps {
  brand?: string
  model: string
  scooterId?: string
  imageUrl?: string
  className?: string
}

export function ScooterImage({ brand, model, scooterId, imageUrl, className }: ScooterImageProps) {
  const [error, setError] = useState(false)

  // Try local image first, then custom URL, then generated fallback
  const localPath = `/images/${model.toLowerCase().replace(/\s/g, '-')}.jpg`
  const fallbackImage = getScooterImage(brand, model, scooterId)

  // If imageUrl is provided, use it; otherwise try local, then fallback
  const src = error
    ? fallbackImage
    : (imageUrl || localPath)

  return (
    <img
      src={src}
      alt={`${brand || ''} ${model}`.trim()}
      className={className}
      onError={() => setError(true)}
    />
  )
}
