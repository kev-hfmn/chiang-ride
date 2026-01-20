import { getAdminShop, getAdminInventory, getAdminBookings } from '@/lib/db/admin'
import { AlertCircle, Calendar as CalendarIcon, ChevronRight } from 'lucide-react'
import { format, addDays, isWithinInterval, parseISO, startOfDay, isSameDay } from 'date-fns'

export default async function CalendarPage() {
  const shop = await getAdminShop()
  
  if (!shop) return null // Or error state

  const scooters = await getAdminInventory(shop.id)
  const bookings = await getAdminBookings(shop.id)

  const startDate = startOfDay(new Date())
  const daysToShow = 14
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">Availability</h1>
           <p className="text-gray-500 text-sm">Next 2 weeks at a glance.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-100 border border-red-200"></span> Booked</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto pb-4">
        <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-[200px_repeat(14,1fr)] border-b border-gray-100">
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
                <div key={scooter.id} className="grid grid-cols-[200px_repeat(14,1fr)] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="p-4 flex items-center gap-3">
                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm shrink-0">
                            🛵
                         </div>
                         <div className="truncate">
                            <div className="font-bold text-gray-900 text-sm">{scooter.model}</div>
                            <div className="text-[10px] text-gray-400">{scooter.brand}</div>
                         </div>
                    </div>
                    {dates.map((date, i) => {
                        // Check availability
                        // Simple logic: Is there a booking covering this date?
                        const booking = bookings.find(b => {
                           const start = parseISO(b.start_date)
                           const end = parseISO(b.end_date)
                           return b.scooter_id === scooter.id && 
                                  isWithinInterval(date, { start: startOfDay(start), end: startOfDay(end) }) &&
                                  b.status !== 'cancelled'
                        })

                        return (
                            <div key={i} className="border-l border-gray-50 relative group h-14">
                                {booking ? (
                                    <div 
                                        className="absolute inset-1 bg-red-100 rounded-md border border-red-200 flex items-center justify-center cursor-pointer"
                                        title={`${booking.customer_name || 'Booked'} (${booking.status})`}
                                    >
                                        {/* Connect adjacent cells visually? For now just standalone blocks */}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                       <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-green-400 transition-colors"></div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
