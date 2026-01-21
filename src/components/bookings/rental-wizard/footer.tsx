'use client'

import { ChevronRight, Loader2 } from 'lucide-react'

interface RentalWizardFooterProps {
  isUploading: boolean
  canContinue: boolean
  isLastStep: boolean
  onNext: () => void
  errorMessage?: string
}

export function RentalWizardFooter({
  isUploading,
  canContinue,
  isLastStep,
  onNext,
  errorMessage,
}: RentalWizardFooterProps) {
  return (
    <div className="p-6 bg-white border-t border-gray-50">
      {errorMessage && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <button
        onClick={onNext}
        disabled={!canContinue || isUploading}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3
          ${canContinue ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Starting Rental...
          </>
        ) : isLastStep ? (
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
  )
}
