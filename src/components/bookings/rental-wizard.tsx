
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, ChevronRight, ChevronLeft, Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { startRentalAction } from '@/app/actions/bookings'
import confetti from 'canvas-confetti'
import { Smartphone } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  image?: string
}

const STEPS: Step[] = [
  { 
    id: 'front', 
    title: 'Front View', 
    description: 'Take a clear photo of the front of the scooter.' 
  },
  { 
    id: 'left', 
    title: 'Left Side', 
    description: 'Capture any existing scratches or dents on the left side.' 
  },
  { 
    id: 'right', 
    title: 'Right Side', 
    description: 'Capture any existing scratches or dents on the right side.' 
  },
  { 
    id: 'back', 
    title: 'Rear View', 
    description: 'Take a photo of the back, including the license plate.' 
  },
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    description: 'Photograph the fuel gauge and odometer reading.' 
  },
]

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
      setPhotos(prev => ({ ...prev, [STEPS[currentStep].id]: result }))
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

    setPhotos(prev => ({ ...prev, [STEPS[currentStep].id]: demoImages[STEPS[currentStep].id] }))
    
    // Optionally still allow real file pick if they double click or similar, but for now
    // let's prioritize the "one-click" demo experience.
    // fileInputRef.current?.click()
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
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
        alert('Failed to start rental. Please try again.')
      }
    } catch (error) {
      console.error('Error completing rental start:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isActuallySuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Check className="w-12 h-12" strokeWidth={3} />
        </motion.div>
        <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-gray-900 mb-4"
        >
            Rental Started!
        </motion.h2>
        <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 max-w-xs mx-auto mb-10 text-lg leading-relaxed"
        >
            You're all set! Enjoy your ride on the <span className="text-black font-bold">{vehicleModel}</span>. Please ride safely.
        </motion.p>
        <motion.button 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => window.location.href = '/app/bookings'}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          Go to My Bookings
        </motion.button>
      </div>
    )
  }

  // If it was already active BEFORE we tried to start it (and we aren't in the finished state)
  if (wasAlreadyActive) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Rental Already Started</h2>
                <p className="text-gray-500 mb-8">
                    This rental has already been verified and started. You can manage it from your dashboard.
                </p>
                <button 
                    onClick={() => window.location.href = '/app/bookings'}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="max-w-md mx-auto bg-white min-h-[80vh] flex flex-col relative overflow-hidden rounded-3xl shadow-xl border border-gray-100">
      
      {/* Header / Progress */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
            <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`p-2 rounded-full transition-colors ${currentStep === 0 ? 'text-gray-200' : 'text-gray-900 hover:bg-gray-100'}`}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Step {currentStep + 1} of {STEPS.length}
            </span>
            <div className="w-10" /> {/* Spacer */}
        </div>
        
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>
      </div>

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
                        {STEPS[currentStep].title}
                    </h2>
                    <p className="text-gray-500 mt-2 text-lg">
                        {STEPS[currentStep].description}
                    </p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div 
                        onClick={triggerCamera}
                        className={`relative w-full aspect-4/3 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                            ${photos[STEPS[currentStep].id] 
                                ? 'border-transparent bg-gray-900 shadow-inner' 
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}`}
                    >
                        {photos[STEPS[currentStep].id] ? (
                            <>
                                <img 
                                    src={photos[STEPS[currentStep].id]} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
                                        <Camera className="w-8 h-8 text-black" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                                    <Check className="w-4 h-4" strokeWidth={4} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-90 mb-4">
                                    <Camera className="w-10 h-10 text-gray-900" />
                                </div>
                                <p className="text-gray-900 font-bold">Tap to take photo</p>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-50">
        <button
            onClick={handleNext}
            disabled={!photos[STEPS[currentStep].id] || isUploading}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3
                ${photos[STEPS[currentStep].id] 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
            {isUploading ? (
                <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Starting Rental...
                </>
            ) : currentStep === STEPS.length - 1 ? (
                <>
                    Start Rental Now
                    <ChevronRight className="w-6 h-6" />
                </>
            ) : (
                <>
                    Continue
                    <ChevronRight className="w-6 h-6" />
                </>
            )}
        </button>
      </div>

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
