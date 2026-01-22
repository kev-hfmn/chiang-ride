# Scooter Pricing System

## Overview

The scooter pricing system supports three pricing tiers:
- **Daily Price**: Base rate per day (required)
- **Weekly Price**: Discounted rate for 7+ day rentals (optional)
- **Monthly Price**: Discounted rate for 30+ day rentals (optional)

The system intelligently selects the best pricing tier based on rental duration to maximize savings for customers.

## Database Schema

```sql
scooters table:
- daily_price (integer, required)
- weekly_price (integer, nullable)
- monthly_price (integer, nullable)
```

## Usage Examples

### 1. Admin Interface - Adding/Editing Scooters

Use the `PricingInput` component in drawer forms:

```tsx
import { PricingInput } from '@/components/ui/pricing-input'

<PricingInput
  dailyPrice={dailyPrice}
  weeklyPrice={weeklyPrice}
  monthlyPrice={monthlyPrice}
  onDailyChange={setDailyPrice}
  onWeeklyChange={setWeeklyPrice}
  onMonthlyChange={setMonthlyPrice}
/>
```

The component displays:
- Three input fields in a row (Daily | Weekly | Monthly)
- Suggested pricing based on daily rate (6x for weekly, 25x for monthly)
- Visual feedback with currency symbols

### 2. Displaying Scooter Prices

The `ScooterCard` component automatically displays all available pricing tiers:

```tsx
import { ScooterCard } from '@/components/scooter-card'

<ScooterCard
  scooter={scooterData}
  isAdmin={false}
/>
```

Shows:
- Daily price (always visible)
- Weekly price (if available)
- Monthly price (if available)

### 3. Calculating Booking Prices

Use the `calculateBookingPrice` function for accurate rental calculations:

```tsx
import { calculateBookingPrice, formatBookingPrice } from '@/lib/services/booking-service'

const calculation = calculateBookingPrice(
  dailyPrice: 250,
  weeklyPrice: 1500,
  monthlyPrice: 4500,
  depositAmount: 1000,
  rentalDays: 10,
  bookingFeePercent: 5
)

// Result:
// {
//   dailyRate: 250,
//   weeklyRate: 1500,
//   monthlyRate: 4500,
//   rentalDays: 10,
//   subtotal: 2142, // 1 week (1500) + 3 days (750)
//   depositAmount: 1000,
//   bookingFee: 107,
//   totalPrice: 3249,
//   priceBreakdown: "1w + 3d",
//   pricePerDay: 214
// }

const formatted = formatBookingPrice(calculation)
// Returns formatted strings for display
```

### 4. Displaying Price Breakdown

Use the `BookingPriceDisplay` component:

```tsx
import { BookingPriceDisplay } from '@/components/booking-price-display'

<BookingPriceDisplay
  dailyPrice={250}
  weeklyPrice={1500}
  monthlyPrice={4500}
  depositAmount={1000}
  rentalDays={10}
  bookingFeePercent={5}
  showBreakdown={true}
/>
```

## Pricing Tier Selection Logic

The system uses this priority:

1. **Monthly (30+ days)**: Uses monthly rate for full months, then applies best rate for remaining days
2. **Weekly (7-29 days)**: Uses weekly rate for full weeks, then applies daily rate for remaining days
3. **Daily (1-6 days)**: Uses daily rate

### Examples:

| Days | Daily | Weekly | Monthly | Result |
|------|-------|--------|---------|--------|
| 3    | 250   | 1500   | 4500    | 3 × 250 = 750฿ |
| 7    | 250   | 1500   | 4500    | 1 × 1500 = 1500฿ |
| 10   | 250   | 1500   | 4500    | 1 × 1500 + 3 × 250 = 2250฿ |
| 30   | 250   | 1500   | 4500    | 1 × 4500 = 4500฿ |
| 35   | 250   | 1500   | 4500    | 1 × 4500 + 5 × 250 = 5750฿ |

## Price Calculator Utilities

### `calculateRentalPrice()`

Core calculation function:

```tsx
import { calculateRentalPrice } from '@/lib/utils/price-calculator'

const result = calculateRentalPrice(
  dailyPrice: 250,
  weeklyPrice: 1500,
  monthlyPrice: 4500,
  days: 10
)

// Returns:
// {
//   price: 2250,
//   breakdown: "1w + 3d",
//   pricePerDay: 225
// }
```

### `getBestDailyRate()`

Get average daily rate for a rental period:

```tsx
import { getBestDailyRate } from '@/lib/utils/price-calculator'

const avgRate = getBestDailyRate(250, 1500, 4500, 10)
// Returns: 225 (average per day)
```

### `formatPriceCalculation()`

Format calculation for display:

```tsx
import { formatPriceCalculation } from '@/lib/utils/price-calculator'

const display = formatPriceCalculation(250, 1500, 4500, 10)
// Returns: "1w + 3d = ฿2,250"
```

## Backend Integration

### Saving Prices

The inventory actions automatically save all three prices:

```tsx
// In add/edit drawer
formData.set('daily_price', dailyPrice.toString())
formData.set('weekly_price', weeklyPrice.toString())
formData.set('monthly_price', monthlyPrice.toString())

await updateScooterAction(scooterId, formData)
```

### Retrieving Prices

All database queries include the pricing fields:

```tsx
const scooter = await getScooter(id)
// Returns: { daily_price, weekly_price, monthly_price, ... }
```

## Best Practices

1. **Always set daily price**: This is the base rate and fallback
2. **Optional weekly/monthly**: Only set if you want to offer discounts
3. **Suggested ratios**:
   - Weekly: 6× daily (e.g., 250 × 6 = 1500)
   - Monthly: 25× daily (e.g., 250 × 25 = 6250)
4. **Display all tiers**: Show available pricing to help customers choose
5. **Use smart calculation**: Let the system pick the best tier automatically

## Migration Notes

If updating existing scooters:
- Daily prices are already set
- Weekly/monthly prices default to NULL
- Existing bookings use daily rate calculation
- New bookings use intelligent tier selection
