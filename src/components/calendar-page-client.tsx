'use client'

import { useState } from 'react'
import { AvailabilityCalendarGrid } from '@/components/availability-calendar-grid'
import { BulkBlockingDrawer } from '@/components/bulk-blocking-drawer'

type Scooter = {
  id: string
  brand: string
  model: string
  number_plate?: string | null
}

type Booking = {
  id: string
  scooter_id: string
  start_date: string
  end_date: string
  status: string
  customer_name?: string
}

type CalendarPageClientProps = {
  scooters: Scooter[]
  bookings: Booking[]
  headerOnly?: boolean
}

export function CalendarPageClient({ scooters, bookings, headerOnly = false }: CalendarPageClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBlockingComplete = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (headerOnly) {
    return <BulkBlockingDrawer scooters={scooters} onBlockingComplete={handleBlockingComplete} />
  }

  return (
    <div className="space-y-4">
      <AvailabilityCalendarGrid 
        scooters={scooters}
        bookings={bookings}
        daysToShow={14}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}
