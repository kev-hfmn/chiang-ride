'use client'

import { useState } from 'react'
import { format, addDays, startOfDay, isSameDay } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

type AvailabilityGridProps = {
  scooterId: string
  initialAvailability: any[]
  isOwner?: boolean
}

export function AvailabilityGrid({ scooterId, initialAvailability, isOwner = false }: AvailabilityGridProps) {
  const [availability, setAvailability] = useState(initialAvailability || [])
  const [updating, setUpdating] = useState<Date | null>(null)
  const supabase = createClient()

  const today = startOfDay(new Date())
  const next14Days = Array.from({ length: 14 }).map((_, i) => addDays(today, i))

  async function toggleAvailability(date: Date, currentStatus: boolean) {
    if (!isOwner) return
    setUpdating(date)

    const dateStr = format(date, 'yyyy-MM-dd')
    const { error } = await supabase
      .from('availability_days')
      .upsert({
        scooter_id: scooterId,
        day: dateStr,
        is_available: !currentStatus
      }, { onConflict: 'scooter_id,day' })

    if (!error) {
      setAvailability(prev => {
        const other = prev.filter(a => a.day !== dateStr)
        return [...other, { day: dateStr, is_available: !currentStatus }]
      })
    }
    setUpdating(null)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {next14Days.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const record = availability.find(a => a.day === dateStr)
        // Default is available if no record exists
        const isAvailable = record ? record.is_available : true
        const isUpdating = updating ? isSameDay(updating, date) : false

        return (
          <button
            key={dateStr}
            disabled={!isOwner || !!isUpdating}
            onClick={() => toggleAvailability(date, isAvailable)}
            className={`
              relative flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all duration-200
              ${isAvailable 
                ? 'bg-green-100 text-green-700 hover:bg-green-200 ring-1 ring-green-200' 
                : 'bg-red-50 text-red-400 hover:bg-red-100 ring-1 ring-red-100 grayscale'}
              ${!isOwner ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}
              ${isUpdating ? 'opacity-50 scale-90' : ''}
            `}
            title={isOwner ? 'Click to toggle availability' : isAvailable ? 'Available' : 'Unavailable'}
          >
            <span className="text-[10px] font-bold uppercase leading-none">{format(date, 'EEE')}</span>
            <span className="text-xs font-bold leading-none mt-0.5">{format(date, 'd')}</span>
            
            {/* Status Dot */}
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-400'}`}></span>
            
            {isUpdating && (
                <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
