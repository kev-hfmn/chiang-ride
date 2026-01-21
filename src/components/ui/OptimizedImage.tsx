'use client'

import Image, { type ImageProps } from 'next/image'

interface OptimizedImageProps {
  src: ImageProps['src']
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  onError?: ImageProps['onError']
}

export default function OptimizedImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 600px',
  priority,
  onError,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      onError={onError}
    />
  )
}
