'use client'

import { calculateBookingPrice, formatBookingPrice } from '@/lib/services/booking-service'
import { Card, CardContent } from '@/components/ui/card'

interface BookingPriceDisplayProps {
  dailyPrice: number
  weeklyPrice?: number | null
  monthlyPrice?: number | null
  depositAmount: number
  rentalDays: number
  bookingFeePercent?: number
  showBreakdown?: boolean
}

export function BookingPriceDisplay({
  dailyPrice,
  weeklyPrice,
  monthlyPrice,
  depositAmount,
  rentalDays,
  bookingFeePercent = 0,
  showBreakdown = true
}: BookingPriceDisplayProps) {
  const calculation = calculateBookingPrice(
    dailyPrice,
    weeklyPrice,
    monthlyPrice,
    depositAmount,
    rentalDays,
    bookingFeePercent
  )

  const formatted = formatBookingPrice(calculation)

  return (
    <Card className="bg-linear-to-br from-orange-50 to-orange-100/50 border-orange-200">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-gray-900">Price Breakdown</h3>
          <p className="text-sm text-gray-600">{rentalDays} day rental</p>
        </div>

        {/* Pricing Tiers Info */}
        {showBreakdown && (
          <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Rate:</span>
              <span className="font-medium text-gray-900">฿{dailyPrice.toLocaleString()}/day</span>
            </div>
            {weeklyPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Rate:</span>
                <span className="font-medium text-gray-900">฿{weeklyPrice.toLocaleString()}/week</span>
              </div>
            )}
            {monthlyPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rate:</span>
                <span className="font-medium text-gray-900">฿{monthlyPrice.toLocaleString()}/month</span>
              </div>
            )}
          </div>
        )}

        {/* Price Calculation */}
        <div className="space-y-3 border-t border-orange-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Rental Cost</span>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatted.rentalCost.split('(')[0].trim()}</p>
              <p className="text-xs text-gray-500">{formatted.rentalCost.split('(')[1]?.replace(')', '')}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Deposit</span>
            <span className="font-semibold text-gray-900">{formatted.deposit}</span>
          </div>

          {calculation.bookingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Booking Fee ({bookingFeePercent}%)</span>
              <span className="font-semibold text-gray-900">{formatted.fee}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-orange-200">
            <span className="font-bold text-gray-900 text-lg">Total</span>
            <span className="font-bold text-orange-600 text-2xl">{formatted.total}</span>
          </div>

          {/* Per Day Average */}
          <div className="text-center text-sm text-gray-600 pt-2">
            Average: {formatted.perDay}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
