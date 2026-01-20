import { getAdminBookings, getAdminShop } from '@/lib/db/admin'
import { format } from 'date-fns'
import { getTranslations } from '@/lib/i18n/server'
import { Calendar, CheckCircle, Clock, Smartphone, User, XCircle, MoreHorizontal } from 'lucide-react'
import { updateBookingStatusAction } from '@/app/actions/bookings'
import { BookingActions } from '@/components/bookings/booking-actions'

export default async function ShopBookingsPage() {
  const shop = await getAdminShop()
  const bookings = shop ? await getAdminBookings(shop.id) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'confirmed': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-50 text-red-600'
      case 'rejected': return 'bg-red-50 text-red-600'
      default: return 'bg-orange-100 text-orange-700'
    }
  }

  const { t } = await getTranslations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-extrabold text-gray-900">{t('bookings')}</h1>
      </div>

      <div className="space-y-4">
        {bookings?.length === 0 ? (
           <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              {t('noBookings')}
           </div>
        ) : bookings?.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
             <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Booking Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                            {booking.status === 'active' ? t('statusActive') : 
                             booking.status === 'confirmed' ? t('statusConfirmed') :
                             booking.status === 'completed' ? t('statusCompleted') :
                             booking.status === 'cancelled' ? t('statusCancelled') :
                             booking.status === 'rejected' ? t('statusRejected') :
                             booking.status === 'pending' || booking.status === 'requested' ? t('statusPending') :
                             booking.status}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">#{booking.id.slice(0, 6)}</span>
                        <span className="text-[10px] text-gray-300 uppercase tracking-tight">Received {format(new Date(booking.created_at), 'MMM d, HH:mm')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{booking.customer_name || t('guestUser')}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Smartphone className="w-3 h-3" />
                                {booking.customer_contact || t('noContactInfo')}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t border-gray-50 pt-3 mt-3">
                        <div className="flex items-center gap-2">
                             <div className="font-bold text-gray-900">{booking.scooters?.model}</div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-gray-400" />
                             <span>{format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-gray-400" />
                             <span>{booking.total_days} Days</span>
                        </div>
                    </div>
                </div>


                {/* Price & Actions */}
                <BookingActions 
                    booking={booking} 
                    labels={{
                        accept: t('accept'),
                        reject: 'Reject', // t('reject') if available, otherwise fallback
                        startRental: 'Start Rental', // t('startRental')
                        markCompleted: t('markCompleted'),
                        total: t('total')
                    }}
                />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
