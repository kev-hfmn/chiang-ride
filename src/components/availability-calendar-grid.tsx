'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfDay, isSameDay, isWithinInterval, parseISO } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { toggleAvailabilityAction } from '@/app/actions/availability'
import { Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  scooter_id: string
  start_date: string
  end_date: string
  status: string
  customer_name?: string
}

type AvailabilityDay = {
  scooter_id: string
  day: string
  is_available: boolean
}

type AvailabilityCalendarGridProps = {
  scooters: Array<{
    id: string
    brand: string
    model: string
    number_plate?: string | null
  }>
  bookings: Booking[]
  daysToShow?: number
  refreshTrigger?: number
}

export function AvailabilityCalendarGrid({ 
  scooters, 
  bookings, 
  daysToShow = 14,
  refreshTrigger = 0
}: AvailabilityCalendarGridProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [availability, setAvailability] = useState<AvailabilityDay[]>([])
  const { showToast } = useToast()
  const supabase = createClient()
  
  // Fetch availability data on mount and when refreshTrigger changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('availability_days')
          .select('scooter_id, day, is_available')
        
        if (error) {
          console.error('Failed to fetch availability:', error)
          return
        }
        
        setAvailability(data || [])
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
    }
    
    fetchAvailability()
  }, [refreshTrigger])
  
  const startDate = startOfDay(new Date())
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i))

  const handleDateClick = async (scooterId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${scooterId}-${dateStr}`
    
    if (updating === key) return
    
    const currentRecord = availability.find(a => a.scooter_id === scooterId && a.day === dateStr)
    const currentAvailability = currentRecord ? currentRecord.is_available : true
    const newAvailability = !currentAvailability
    
    setUpdating(key)
    
    // Optimistic update
    setAvailability(prev => {
      const filtered = prev.filter(a => !(a.scooter_id === scooterId && a.day === dateStr))
      return [...filtered, { scooter_id: scooterId, day: dateStr, is_available: newAvailability }]
    })
    
    try {
      await toggleAvailabilityAction(scooterId, dateStr, newAvailability)
      showToast.success(
        newAvailability ? 'Date Available' : 'Date Blocked',
        `${format(date, 'MMM d')} is now ${newAvailability ? 'available' : 'blocked'}`
      )
    } catch (error) {
      console.error('Failed to update availability:', error)
      // Revert optimistic update on error
      setAvailability(prev => {
        const filtered = prev.filter(a => !(a.scooter_id === scooterId && a.day === dateStr))
        if (currentRecord) return [...filtered, currentRecord]
        return filtered
      })
      showToast.error('Update Failed', 'Could not update availability')
    } finally {
      setUpdating(null)
    }
  }

  const isDateBooked = (scooterId: string, date: Date): Booking | undefined => {
    return bookings.find(b => {
      const start = parseISO(b.start_date)
      const end = parseISO(b.end_date)
      return b.scooter_id === scooterId &&
             isWithinInterval(date, { start: startOfDay(start), end: startOfDay(end) }) &&
             b.status !== 'cancelled'
    })
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-[150px_repeat(14,1fr)] border-b border-gray-100">
            <div className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Scooter</div>
          {dates.map((date, i) => (
            <div key={i} className="p-2 text-center border-l border-gray-50 bg-gray-50/50">
              <div className="text-[10px] text-gray-400 font-bold uppercase">{format(date, 'EEE')}</div>
              <div className={`text-sm font-bold ${isSameDay(date, new Date()) ? 'text-orange-600' : 'text-gray-700'}`}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Scooter Rows */}
        {scooters.map(scooter => (
          <div key={scooter.id} className="grid grid-cols-[150px_repeat(14,1fr)] border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="p-2 flex items-center gap-3">

              <div className="truncate pl-2">
                <div className="font-bold text-gray-900 text-sm">{scooter.model}</div>
               
                {scooter.number_plate && (
                  <div className="text-[14px] text-gray-500 font-mono mt-0.5">{scooter.number_plate}</div>
                )}
              
              </div>
            </div>
            {dates.map((date, i) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const booking = isDateBooked(scooter.id, date)
              const availabilityRecord = availability.find(a => a.scooter_id === scooter.id && a.day === dateStr)
              const isAvailable = availabilityRecord ? availabilityRecord.is_available : true
              const key = `${scooter.id}-${dateStr}`
              const isUpdating = updating === key
              const isPast = isSameDay(date, new Date()) || date < new Date()

              return (
                <button
                  key={i}
                  onClick={() => !booking && !isPast && handleDateClick(scooter.id, date)}
                  disabled={!!booking || isPast || isUpdating}
                  className="border-l border-gray-50 relative group h-14 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                  title={booking ? `Booked - ${booking.customer_name || 'Customer'}` : isPast ? 'Past date' : isAvailable ? 'Click to block' : 'Click to enable'}
                >
                  {booking ? (
                    <div className="absolute inset-1 bg-red-100 rounded-md border border-red-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isUpdating ? (
                        <Clock className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          isPast ? 'bg-gray-200' : isAvailable ? 'bg-green-400 group-hover:bg-orange-400' : 'bg-gray-300 group-hover:bg-green-400'
                        }`} />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ))}
        </div>
      </div>

      {/* Legend - Moved to bottom */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-center gap-6 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            Blocked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
            Booked
          </div>
        </div>
      </div>
    </div>
  )
}
