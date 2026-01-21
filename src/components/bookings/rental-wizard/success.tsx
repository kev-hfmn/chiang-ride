'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface RentalWizardSuccessProps {
  vehicleModel: string
  onGoToBookings: () => void
}

export function RentalWizardSuccess({ vehicleModel, onGoToBookings }: RentalWizardSuccessProps) {
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
        You&apos;re all set! Enjoy your ride on the{' '}
        <span className="text-black font-bold">{vehicleModel}</span>. Please ride safely.
      </motion.p>
      <motion.button
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onGoToBookings}
        className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
      >
        Go to My Bookings
      </motion.button>
    </div>
  )
}
