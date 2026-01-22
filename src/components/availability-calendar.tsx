'use client'

import { useState, useOptimistic } from 'react'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval, 
  startOfDay, 
  isBefore,
  getDay
} from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { toggleAvailabilityAction } from '@/app/actions/availability'

type DateRange = {
  start: Date
  end: Date
}

type AvailabilityDay = {
  date: string // YYYY-MM-DD
  isAvailable: boolean
}

type Scooter = {
  id: string
  model: string
  brand: string
  number_plate?: string | null
}

type AvailabilityCalendarProps = {
  scooter: Scooter
  unavailableDates?: Date[] // Individual unavailable dates (e.g. from manual blocks)
  bookings?: DateRange[]    // Booked ranges
  availabilityOverrides?: AvailabilityDay[] // Manual availability overrides
  onAvailabilityChange?: (date: string, isAvailable: boolean) => void
}

export default function AvailabilityCalendar({ 
  scooter,
  unavailableDates = [], 
  bookings = [],
  availabilityOverrides = [],
  onAvailabilityChange
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { showToast } = useToast()
  
  // Optimistic updates for availability changes
  const [optimisticOverrides, setOptimisticOverrides] = useOptimistic(
    availabilityOverrides,
    (state, { date, isAvailable }: { date: string, isAvailable: boolean }) => {
      const existing = state.find(item => item.date === date)
      if (existing) {
        return state.map(item => 
          item.date === date ? { ...item, isAvailable } : item
        )
      }
      return [...state, { date, isAvailable }]
    }
  )

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Fill in empty days at start for alignment
  const startDay = getDay(monthStart) // 0 = Sunday
  const emptyDays = Array(startDay).fill(null)

  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const isPast = isBefore(date, startOfDay(new Date()))
    
    // Check manual availability override
    const override = optimisticOverrides.find(item => item.date === dateStr)
    if (override) {
      return {
        isUnavailable: !override.isAvailable || isPast,
        isBooked: false,
        isManuallyBlocked: !override.isAvailable,
        canToggle: !isPast
      }
    }

    // Check past dates
    if (isPast) {
      return { isUnavailable: true, isBooked: false, isManuallyBlocked: false, canToggle: false }
    }

    // Check specific unavailable dates
    if (unavailableDates.some(d => isSameDay(d, date))) {
      return { isUnavailable: true, isBooked: false, isManuallyBlocked: true, canToggle: true }
    }

    // Check confirmed bookings
    const isBooked = bookings.some(range => isWithinInterval(date, { start: range.start, end: range.end }))
    if (isBooked) {
      return { isUnavailable: true, isBooked: true, isManuallyBlocked: false, canToggle: false }
    }

    return { isUnavailable: false, isBooked: false, isManuallyBlocked: false, canToggle: true }
  }
  
  const handleDateClick = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const status = getDateStatus(date)
    
    console.log('Date clicked:', dateStr, 'Status:', status)
    
    if (!status.canToggle || isUpdating === dateStr) {
      console.log('Click ignored - cannot toggle or already updating')
      return
    }
    
    // Toggle logic: if currently unavailable (blocked), make it available; if available, make it unavailable
    const newAvailability = !status.isUnavailable
    
    console.log('Toggling to:', newAvailability)
    
    // Optimistic update
    setOptimisticOverrides({ date: dateStr, isAvailable: newAvailability })
    setIsUpdating(dateStr)
    
    try {
      await toggleAvailabilityAction(scooter.id, dateStr, newAvailability)
      showToast.success(
        newAvailability ? 'Date Available' : 'Date Blocked',
        `${format(date, 'MMM d')} is now ${newAvailability ? 'available' : 'blocked'}`
      )
      onAvailabilityChange?.(dateStr, newAvailability)
    } catch (error) {
      console.error('Toggle failed:', error)
      // Revert optimistic update on error
      const revertAvailability = !newAvailability
      setOptimisticOverrides({ date: dateStr, isAvailable: revertAvailability })
      showToast.error('Update Failed', 'Could not update availability')
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 w-full max-w-md mx-auto shadow-sm">
      {/* Scooter Info Header */}
      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{scooter.brand} {scooter.model}</h3>
            {scooter.number_plate && (
              <p className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded border inline-block mt-1">
                {scooter.number_plate}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h4>
        <div className="flex gap-1">
          <button 
            onClick={prevMonth} 
            disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(new Date()))} // Prevent going back past today (approx)
            aria-label="Previous month"
            className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {daysInMonth.map(date => {
          const status = getDateStatus(date)
          const isToday = isSameDay(date, new Date())
          const dateStr = format(date, 'yyyy-MM-dd')
          const updating = isUpdating === dateStr

          return (
            <button 
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={!status.canToggle || updating}
              className={`
                relative h-9 w-9 flex items-center justify-center text-sm rounded-full transition-all duration-200
                ${status.isUnavailable
                  ? status.isBooked
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                  : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'}
                ${status.canToggle ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                ${isToday ? 'ring-2 ring-orange-400 ring-offset-1' : ''}
                ${updating ? 'animate-pulse' : ''}
              `}
              title={`${format(date, 'MMM d, yyyy')} - ${
                status.isBooked ? 'Booked' : 
                status.isManuallyBlocked ? 'Blocked (click to enable)' :
                status.isUnavailable ? 'Unavailable' : 
                'Available (click to block)'
              }`}
            >
              {updating ? (
                <Clock className="w-3 h-3 animate-spin" />
              ) : (
                format(date, 'd')
              )}
            </button>
          )
        })}
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-xs text-gray-500 text-center mb-3">
          Click any date to toggle availability
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
            Available
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
            Blocked
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
            Booked
          </div>
        </div>
      </div>
    </div>
  )
}
