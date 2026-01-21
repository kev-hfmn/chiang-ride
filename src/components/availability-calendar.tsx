'use client'

import { useState } from 'react'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'

type DateRange = {
  start: Date
  end: Date
}

type AvailabilityCalendarProps = {
  unavailableDates: Date[] // Individual unavailable dates (e.g. from manual blocks)
  bookings: DateRange[]    // Booked ranges
}

export default function AvailabilityCalendar({ unavailableDates = [], bookings = [] }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Fill in empty days at start for alignment
  const startDay = getDay(monthStart) // 0 = Sunday
  const emptyDays = Array(startDay).fill(null)

  const isDateUnavailable = (date: Date) => {
    // Check past dates
    if (isBefore(date, startOfDay(new Date()))) return true

    // Check specific unavailable dates
    if (unavailableDates.some(d => isSameDay(d, date))) return true

    // Check confirmed bookings
    if (bookings.some(range => isWithinInterval(date, { start: range.start, end: range.end }))) return true

    return false
  }

  const isDateBooked = (date: Date) => {
     return bookings.some(range => isWithinInterval(date, { start: range.start, end: range.end }))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 w-full max-w-sm mx-auto shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h3>
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
          const unavailable = isDateUnavailable(date)
          const booked = isDateBooked(date)
          const isToday = isSameDay(date, new Date())

          return (
            <div 
              key={date.toISOString()} 
              className={`
                relative h-9 flex items-center justify-center text-sm rounded-full
                ${unavailable 
                  ? 'text-gray-300 decoration-gray-300 line-through' 
                  : 'text-gray-900 font-bold hover:bg-gray-100 cursor-pointer'}
                ${isToday && !unavailable ? 'ring-1 ring-black' : ''}
              `}
            >
              {format(date, 'd')}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500 justify-center">
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-900"></div>
            Available
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-300 opacity-50 skew-x-12"></div>
            </div>
            Booked/Unavailable
        </div>
      </div>
    </div>
  )
}
