'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { getScooterImage } from '@/lib/scooter-images'

interface ScooterImageProps {
  brand?: string
  model: string
  scooterId?: string
  imageUrl?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export function ScooterImage({ brand, model, scooterId, imageUrl, className, fill = false, width, height }: ScooterImageProps) {
  const [error, setError] = useState(false)

  // Try local image first, then custom URL, then generated fallback
  const localPath = `/images/${model.toLowerCase().replace(/\s/g, '-')}.jpg`
  const fallbackImage = getScooterImage(brand, model, scooterId)

  // If imageUrl is provided, use it; otherwise try local, then fallback
  const src = error
    ? fallbackImage
    : (imageUrl || localPath)

  return (
    <OptimizedImage
      src={src}
      alt={`${brand || ''} ${model}`.trim()}
      className={className}
      fill={fill}
      width={fill ? undefined : (width || 96)}
      height={fill ? undefined : (height || 96)}
      sizes={fill ? "(max-width: 768px) 100vw, 400px" : undefined}
      priority={false}
      onError={() => setError(true)}
    />
  )
}
