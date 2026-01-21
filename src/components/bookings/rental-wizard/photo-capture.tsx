'use client'

import Image from 'next/image'
import { Camera, Check } from 'lucide-react'
import type { RentalStep } from './steps'

interface RentalWizardPhotoCaptureProps {
  step: RentalStep
  image?: string
  onTrigger: () => void
}

export function RentalWizardPhotoCapture({ step, image, onTrigger }: RentalWizardPhotoCaptureProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <button
        type="button"
        onClick={onTrigger}
        className={`relative w-full aspect-4/3 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
          ${image ? 'border-transparent bg-gray-900 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}`}
      >
        {image ? (
          <>
            <Image
              src={image}
              alt={`${step.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover opacity-90"
              unoptimized
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
      </button>
    </div>
  )
}
