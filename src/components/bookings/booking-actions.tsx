
'use client'

import { useState } from 'react'
import { Booking } from '@/lib/types/custom'
import { CheckCircle, XCircle, Play, CheckSquare } from 'lucide-react'
import { updateBookingStatusAction } from '@/app/actions/bookings'
import { QRCodeModal } from './qr-code-modal'

interface BookingActionsProps {
  booking: Booking
  // We can pass translations or generic strings if i18n is complex in client components
  // For now we'll hardcode or assume simple props
  labels: {
    accept: string
    reject: string
    startRental: string
    markCompleted: string
    total: string
  }
}

export function BookingActions({ booking, labels }: BookingActionsProps) {
  const [showQRModal, setShowQRModal] = useState(false)

  // Status flow:
  // requested/pending -> [Accept] -> confirmed
  // confirmed -> [Start Rental] -> active
  // active -> [Mark Completed] -> completed

  return (
    <>
      <div className="flex flex-row sm:flex-col justify-between items-end gap-4 min-w-[120px]">
        
        {/* Price Display */}
        <div className="text-right">
            <div className="text-2xl font-extrabold text-gray-900">{booking.total_price}฿</div>
            <div className="text-xs text-gray-400">{labels.total}</div>
        </div>

        {/* ACTIONS */}
        
        {/* Pending / Requested */}
        {(booking.status === 'requested' || booking.status === 'pending') && (
            <div className="flex gap-2 w-full sm:w-auto">
                <form action={updateBookingStatusAction}>
                    <input type="hidden" name="booking_id" value={booking.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors" title={labels.reject}>
                        <XCircle className="w-6 h-6" />
                    </button>
                </form>
                <form action={updateBookingStatusAction}>
                    <input type="hidden" name="booking_id" value={booking.id} />
                    {/* Accept now moves to 'confirmed', waiting for pickup */}
                    <input type="hidden" name="status" value="confirmed" />
                    <button className="flex-1 sm:flex-initial px-4 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                        <CheckCircle className="w-4 h-4" />
                        {labels.accept}
                    </button>
                </form>
            </div>
        )}

        {/* Confirmed - Waiting for pickup */}
        {booking.status === 'confirmed' && (
             <button 
                onClick={() => setShowQRModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
             >
                <Play className="w-4 h-4 fill-current" />
                {labels.startRental}
             </button>
        )}

        {/* Active - Ongoing */}
        {booking.status === 'active' && (
            <form action={updateBookingStatusAction} className="w-full sm:w-auto">
                    <input type="hidden" name="booking_id" value={booking.id} />
                    <input type="hidden" name="status" value="completed" />
                    <button className="w-full sm:w-auto px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold text-sm transition-colors border border-green-200 flex items-center justify-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        {labels.markCompleted}
                    </button>
            </form>
        )}
      </div>

      <QRCodeModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
        bookingId={booking.id}
        vehicleModel={booking.scooters?.model || 'Scooter'}
      />
    </>
  )
}
