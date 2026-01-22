/**
 * Calculate rental price based on duration and available pricing tiers
 * Prioritizes longer-term discounts when available
 */
export function calculateRentalPrice(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  days: number
): {
  price: number
  breakdown: string
  pricePerDay: number
} {
  if (days <= 0) {
    return {
      price: 0,
      breakdown: '0 days',
      pricePerDay: 0
    }
  }

  // Calculate weeks and remaining days
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7

  // Calculate months and remaining days (30 days per month)
  const months = Math.floor(days / 30)
  const daysAfterMonths = days % 30

  let totalPrice = 0
  let breakdown = ''

  // Strategy: Use the best available pricing tier
  if (monthlyPrice && days >= 30) {
    // Use monthly pricing for 30+ day periods
    const monthsToUse = Math.floor(days / 30)
    const remainingDaysAfterMonths = days % 30

    totalPrice = monthsToUse * monthlyPrice

    if (remainingDaysAfterMonths > 0) {
      // For remaining days, use the best rate (weekly or daily)
      if (weeklyPrice && remainingDaysAfterMonths >= 7) {
        const weeksRemaining = Math.floor(remainingDaysAfterMonths / 7)
        const daysRemaining = remainingDaysAfterMonths % 7
        totalPrice += weeksRemaining * weeklyPrice + daysRemaining * dailyPrice
        breakdown = `${monthsToUse}m + ${weeksRemaining}w + ${daysRemaining}d`
      } else {
        totalPrice += remainingDaysAfterMonths * dailyPrice
        breakdown = `${monthsToUse}m + ${remainingDaysAfterMonths}d`
      }
    } else {
      breakdown = `${monthsToUse}m`
    }
  } else if (weeklyPrice && days >= 7) {
    // Use weekly pricing for 7+ day periods
    const weeksToUse = Math.floor(days / 7)
    const remainingDaysAfterWeeks = days % 7

    totalPrice = weeksToUse * weeklyPrice

    if (remainingDaysAfterWeeks > 0) {
      totalPrice += remainingDaysAfterWeeks * dailyPrice
      breakdown = `${weeksToUse}w + ${remainingDaysAfterWeeks}d`
    } else {
      breakdown = `${weeksToUse}w`
    }
  } else {
    // Use daily pricing
    totalPrice = days * dailyPrice
    breakdown = `${days}d`
  }

  const pricePerDay = Math.round(totalPrice / days)

  return {
    price: totalPrice,
    breakdown,
    pricePerDay
  }
}

/**
 * Get the best available price per day based on rental duration
 * Useful for displaying estimated daily rates
 */
export function getBestDailyRate(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  days: number = 1
): number {
  const calculation = calculateRentalPrice(dailyPrice, weeklyPrice, monthlyPrice, days)
  return calculation.pricePerDay
}

/**
 * Format price calculation for display
 */
export function formatPriceCalculation(
  dailyPrice: number,
  weeklyPrice: number | null | undefined,
  monthlyPrice: number | null | undefined,
  days: number
): string {
  const calc = calculateRentalPrice(dailyPrice, weeklyPrice, monthlyPrice, days)
  return `${calc.breakdown} = ฿${calc.price.toLocaleString()}`
}
