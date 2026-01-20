'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ScooterImageProps {
  model: string
  className?: string
}

export function ScooterImage({ model, className }: ScooterImageProps) {
  const [error, setError] = useState(false)
  const imagePath = `/images/${model.toLowerCase().replace(/\s/g, '-')}.jpg`
  const fallbackImage = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'

  return (
    <img
      src={error ? fallbackImage : imagePath}
      alt={model}
      className={className}
      onError={() => setError(true)}
    />
  )
}
