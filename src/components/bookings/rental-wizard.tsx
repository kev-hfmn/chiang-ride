'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { startRentalAction } from '@/app/actions/bookings'
import confetti from 'canvas-confetti'
import { RentalWizardHeader } from './rental-wizard/header'
import { RentalWizardSuccess } from './rental-wizard/success'
import { RentalWizardAlreadyActive } from './rental-wizard/already-active'
import { RentalWizardPhotoCapture } from './rental-wizard/photo-capture'
import { RentalWizardFooter } from './rental-wizard/footer'
import { RENTAL_STEPS } from './rental-wizard/steps'
import { logger } from '@/lib/utils/logger'

interface RentalWizardProps {
  bookingId: string
  vehicleModel: string
  initialStatus: string
}

export function RentalWizard({ bookingId, vehicleModel, initialStatus }: RentalWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const isActuallySuccess = isFinished || searchParams.get('success') === 'true'

  // Track if we ALREADY had an active status when we loaded, 
  // but ONLY if we aren't currently seeing a success screen
  const wasAlreadyActive = (initialStatus === 'active' || initialStatus === 'completed') && !isActuallySuccess

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Trigger confetti once if we just arrived at the success state
  useEffect(() => {
    if (isActuallySuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#ffffff']
      })
    }
  }, [isActuallySuccess])

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPhotos(prev => ({ ...prev, [RENTAL_STEPS[currentStep].id]: result }))
    }
    reader.readAsDataURL(file)
  }

  const triggerCamera = () => {
    // DEMO OPTIMIZATION: For laptop showcase, we'll auto-fill with a nice scooter image
    // if the user clicks the placeholder. This makes the demo fast and smooth.
    const demoImages: Record<string, string> = {
      front: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      left: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      right: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      back: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      dashboard: 'https://images.unsplash.com/photo-1517454228913-976cc5c29007?auto=format&fit=crop&w=800&q=80'
    }

    setPhotos(prev => ({ ...prev, [RENTAL_STEPS[currentStep].id]: demoImages[RENTAL_STEPS[currentStep].id] }))
    
    // Optionally still allow real file pick if they double click or similar, but for now
    // let's prioritize the "one-click" demo experience.
    // fileInputRef.current?.click()
  }

  const handleNext = () => {
    if (currentStep < RENTAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsUploading(true)
    setErrorMessage(null)
    
    try {
      // 1. Upload photos to Supabase Storage
      const uploadPromises = Object.entries(photos).map(async ([stepId, base64]) => {
        const response = await fetch(base64)
        const blob = await response.blob()
        const fileName = `${bookingId}/${stepId}.jpg`
        
        const { data, error } = await supabase.storage
          .from('rental-verification')
          .upload(fileName, blob, { upsert: true })
          
        if (error) throw error
        return data.path
      })

      await Promise.all(uploadPromises)

      // 2. Trigger active status
      const result = await startRentalAction(bookingId)
      
      if (result.success) {
        // Update URL to persist success state through revalidation
        const url = new URL(window.location.href)
        url.searchParams.set('success', 'true')
        router.push(url.pathname + url.search)
        
        setIsFinished(true)
      } else {
        setErrorMessage('Failed to start rental. Please try again.')
      }
    } catch (error) {
      logger.error('Failed to complete rental start', error, { bookingId })
      setErrorMessage('An error occurred. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isActuallySuccess) {
    return (
      <RentalWizardSuccess
        vehicleModel={vehicleModel}
        onGoToBookings={() => window.location.assign('/bookings')}
      />
    )
  }

  // If it was already active BEFORE we tried to start it (and we aren't in the finished state)
  if (wasAlreadyActive) {
    return <RentalWizardAlreadyActive onGoToBookings={() => window.location.assign('/bookings')} />
  }

  const progress = ((currentStep + 1) / RENTAL_STEPS.length) * 100

  return (
    <div className="max-w-md mx-auto bg-white min-h-[80vh] flex flex-col relative overflow-hidden rounded-3xl shadow-xl border border-gray-100">
      <RentalWizardHeader
        currentStep={currentStep}
        totalSteps={RENTAL_STEPS.length}
        progress={progress}
        onBack={handleBack}
        isBackDisabled={currentStep === 0}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col"
            >
                <div className="mt-4 mb-8">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {RENTAL_STEPS[currentStep].title}
                  </h2>
                  <p className="text-gray-500 mt-2 text-lg">
                    {RENTAL_STEPS[currentStep].description}
                  </p>
                </div>

                <RentalWizardPhotoCapture
                  step={RENTAL_STEPS[currentStep]}
                  image={photos[RENTAL_STEPS[currentStep].id]}
                  onTrigger={triggerCamera}
                />
            </motion.div>
        </AnimatePresence>
      </div>

      <RentalWizardFooter
        isUploading={isUploading}
        canContinue={Boolean(photos[RENTAL_STEPS[currentStep].id])}
        isLastStep={currentStep === RENTAL_STEPS.length - 1}
        onNext={handleNext}
        errorMessage={errorMessage ?? undefined}
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handlePhotoCapture}
      />
    </div>
  )
}
