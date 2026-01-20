'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade' | 'scale' | 'blur'

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function AnimateOnScroll({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, once])

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out, filter ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    }

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(40px)' }
        case 'fade-down':
          return { ...baseStyles, opacity: 0, transform: 'translateY(-40px)' }
        case 'fade-left':
          return { ...baseStyles, opacity: 0, transform: 'translateX(40px)' }
        case 'fade-right':
          return { ...baseStyles, opacity: 0, transform: 'translateX(-40px)' }
        case 'fade':
          return { ...baseStyles, opacity: 0 }
        case 'scale':
          return { ...baseStyles, opacity: 0, transform: 'scale(0.95)' }
        case 'blur':
          return { ...baseStyles, opacity: 0, filter: 'blur(10px)' }
        default:
          return baseStyles
      }
    }

    return { ...baseStyles, opacity: 1, transform: 'none', filter: 'none' }
  }

  return (
    <div ref={ref} className={cn(className)} style={getAnimationStyles()}>
      {children}
    </div>
  )
}

// Stagger container for animating children with delays
export function AnimateStagger({
  children,
  className,
  staggerDelay = 100,
  animation = 'fade-up',
  baseDelay = 0,
}: {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  animation?: AnimationType
  baseDelay?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimateOnScroll
          key={index}
          animation={animation}
          delay={baseDelay + index * staggerDelay}
        >
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  )
}
