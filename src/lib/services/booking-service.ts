import { calculateRentalPrice } from '@/lib/utils/price-calculator'

export interface BookingPriceCalculation {
  dailyRate: number
  weeklyRate: number | null
  monthlyRate: number | null
  rentalDays: number
  subtotal: number
  depositAmount: number
  bookingFee: number
  totalPrice: number
  priceBreakdown: string
  pricePerDay: number
}

/**
 * Calculate total booking price including deposit and fees
 * Uses intelligent pricing tier selection based on rental duration
 */
export function calculateBookingPrice(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  depositAmount: number,
  rentalDays: number,
  bookingFeePercent: number = 0
): BookingPriceCalculation {
  // Calculate rental cost using best available pricing tier
  const rentalCalculation = calculateRentalPrice(
    dailyPrice,
    weeklyPrice,
    monthlyPrice,
    rentalDays
  )

  const subtotal = rentalCalculation.price
  const bookingFee = Math.round(subtotal * (bookingFeePercent / 100))
  const totalPrice = subtotal + depositAmount + bookingFee

  return {
    dailyRate: dailyPrice,
    weeklyRate: weeklyPrice || null,
    monthlyRate: monthlyPrice || null,
    rentalDays,
    subtotal,
    depositAmount,
    bookingFee,
    totalPrice,
    priceBreakdown: rentalCalculation.breakdown,
    pricePerDay: rentalCalculation.pricePerDay
  }
}

/**
 * Format booking price calculation for display
 */
export function formatBookingPrice(calculation: BookingPriceCalculation): {
  rentalCost: string
  deposit: string
  fee: string
  total: string
  perDay: string
} {
  return {
    rentalCost: `฿${calculation.subtotal.toLocaleString()} (${calculation.priceBreakdown})`,
    deposit: `฿${calculation.depositAmount.toLocaleString()}`,
    fee: calculation.bookingFee > 0 ? `฿${calculation.bookingFee.toLocaleString()}` : 'Free',
    total: `฿${calculation.totalPrice.toLocaleString()}`,
    perDay: `฿${calculation.pricePerDay.toLocaleString()}/day`
  }
}

/**
 * Get estimated price for a given number of days
 * Useful for quick price lookups
 */
export function getEstimatedPrice(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  days: number
): number {
  const calc = calculateRentalPrice(dailyPrice, weeklyPrice, monthlyPrice, days)
  return calc.price
}

/**
 * Determine which pricing tier is being used
 */
export function getPricingTierUsed(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  days: number
): 'daily' | 'weekly' | 'monthly' {
  if (monthlyPrice && days >= 30) {
    return 'monthly'
  }
  if (weeklyPrice && days >= 7) {
    return 'weekly'
  }
  return 'daily'
}
