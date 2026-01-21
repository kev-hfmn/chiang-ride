import { getAdminBookings, getAdminShop } from '@/lib/db/admin'
import { format } from 'date-fns'
import { getTranslations } from '@/lib/i18n/server'
import { Calendar, Clock, Smartphone, User } from 'lucide-react'
import { BookingActions } from '@/components/bookings/booking-actions'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default async function ShopBookingsPage() {
  const shop = await getAdminShop()
  const bookings = shop ? await getAdminBookings(shop.id) : []

  const { t } = await getTranslations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-extrabold text-gray-900">{t('bookings')}</h1>
      </div>

      <div className="space-y-4">
        {bookings?.length === 0 ? (
           <Card className="border-dashed">
              <CardContent className="p-10 text-center text-gray-400">
                {t('noBookings')}
              </CardContent>
           </Card>
        ) : bookings?.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-5">
             <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Booking Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <StatusBadge status={booking.status} size="sm" />
                        <span className="text-xs text-gray-400 font-mono">#{booking.id.slice(0, 6)}</span>
                        <span className="text-[10px] text-gray-300 uppercase tracking-tight">Received {format(new Date(booking.created_at), 'MMM d, HH:mm')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-100 text-gray-500">
                                <User className="w-5 h-5" />
                            </AvatarFallback>
                        </Avatar>
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
                        reject: t('reject'),
                        startRental: t('startRental'),
                        markCompleted: t('markCompleted'),
                        total: t('total')
                    }}
                />
             </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
