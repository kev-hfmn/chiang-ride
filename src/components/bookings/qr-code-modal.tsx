
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  vehicleModel: string
}

export function QRCodeModal({ isOpen, onClose, bookingId, vehicleModel }: QRCodeModalProps) {
  const [status, setStatus] = useState<string>('waiting')
  const supabase = createClient()
  const router = useRouter()

  // Listen for booking status changes
  useEffect(() => {
    if (!isOpen) return

    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.new.status === 'active') {
            setStatus('success')
            setTimeout(() => {
                onClose()
                router.refresh()
            }, 2000)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, bookingId, supabase, onClose, router])

  // Reset status on open
  useEffect(() => {
    if (isOpen) setStatus('waiting')
  }, [isOpen])

  // Rental Start URL
  // In production, this would be https://chiang-ride.com/rental/start/${bookingId}
  // For dev, we assume localhost or the current origin.
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const startUrl = `${origin}/app/rental/start/${bookingId}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Start Rental</h3>
                    <p className="text-sm text-gray-500">Scan to verify & document condition</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col items-center gap-6">
                
                {status === 'waiting' ? (
                    <>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-64 h-64 bg-white flex items-center justify-center">
                                <QRCode 
                                    value={startUrl} 
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <p className="font-medium text-gray-900">Ask {vehicleModel} renter to scan</p>
                            <p className="text-sm text-gray-500">They will be guided to take photos</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                            Waiting for scan...
                        </div>
                    </>
                ) : (
                    <div className="py-10 flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </motion.div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">Rental Started!</h4>
                            <p className="text-gray-500">The booking is now active.</p>
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
