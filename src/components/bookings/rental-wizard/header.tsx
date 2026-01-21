'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface RentalWizardHeaderProps {
  currentStep: number
  totalSteps: number
  progress: number
  onBack: () => void
  isBackDisabled: boolean
}

export function RentalWizardHeader({
  currentStep,
  totalSteps,
  progress,
  onBack,
  isBackDisabled,
}: RentalWizardHeaderProps) {
  return (
    <div className="p-6 pb-2">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          disabled={isBackDisabled}
          aria-label="Go to previous step"
          className={`p-2 rounded-full transition-colors ${
            isBackDisabled ? 'text-gray-200' : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="w-10" />
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
  )
}
