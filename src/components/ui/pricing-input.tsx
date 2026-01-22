'use client'

import { Input } from '@/components/ui/input'

interface PricingInputProps {
  dailyPrice?: number
  weeklyPrice?: number
  monthlyPrice?: number
  onDailyChange?: (value: number) => void
  onWeeklyChange?: (value: number) => void
  onMonthlyChange?: (value: number) => void
  translations?: {
    daily?: string
    weekly?: string
    monthly?: string
  }
}

export function PricingInput({
  dailyPrice = 0,
  weeklyPrice = 0,
  monthlyPrice = 0,
  onDailyChange,
  onWeeklyChange,
  onMonthlyChange,
  translations = {}
}: PricingInputProps) {
  const { daily = 'Daily', weekly = 'Weekly', monthly = 'Monthly' } = translations

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-900">Pricing</label>
      <div className="grid grid-cols-3 gap-3">
        {/* Daily Price */}
        <div className="space-y-1">
          <label htmlFor="daily_price" className="text-xs font-semibold text-gray-700 block">
            {daily}
          </label>
          <div className="relative">
            <Input
              type="number"
              name="daily_price"
              id="daily_price"
              value={dailyPrice || ''}
              onChange={(e) => onDailyChange?.(parseInt(e.target.value) || 0)}
              placeholder="250"
              className="h-11 rounded-lg pr-8 text-center"
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              ฿
            </span>
          </div>
        </div>

        {/* Weekly Price */}
        <div className="space-y-1">
          <label htmlFor="weekly_price" className="text-xs font-semibold text-gray-700 block">
            {weekly}
          </label>
          <div className="relative">
            <Input
              type="number"
              name="weekly_price"
              id="weekly_price"
              value={weeklyPrice || ''}
              onChange={(e) => onWeeklyChange?.(parseInt(e.target.value) || 0)}
              placeholder="1500"
              className="h-11 rounded-lg pr-8 text-center"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              ฿
            </span>
          </div>
        </div>

        {/* Monthly Price */}
        <div className="space-y-1">
          <label htmlFor="monthly_price" className="text-xs font-semibold text-gray-700 block">
            {monthly}
          </label>
          <div className="relative">
            <Input
              type="number"
              name="monthly_price"
              id="monthly_price"
              value={monthlyPrice || ''}
              onChange={(e) => onMonthlyChange?.(parseInt(e.target.value) || 0)}
              placeholder="4500"
              className="h-11 rounded-lg pr-8 text-center"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              ฿
            </span>
          </div>
        </div>
      </div>

      {/* Price Suggestion Helper */}
      {dailyPrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
          <p className="font-medium">Suggested prices based on daily rate:</p>
          <p>Weekly: {Math.round(dailyPrice * 6)}฿ (6 days)</p>
          <p>Monthly: {Math.round(dailyPrice * 25)}฿ (25 days)</p>
        </div>
      )}
    </div>
  )
}
