'use client'

import { Smartphone } from 'lucide-react'

interface RentalWizardAlreadyActiveProps {
  onGoToBookings: () => void
}

export function RentalWizardAlreadyActive({ onGoToBookings }: RentalWizardAlreadyActiveProps) {
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
          onClick={onGoToBookings}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
