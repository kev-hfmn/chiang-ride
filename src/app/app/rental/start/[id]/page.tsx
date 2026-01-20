
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { RentalWizard } from '@/components/bookings/rental-wizard'
import { Smartphone } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RentalStartPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  // Fetch booking with scooter details
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
        *,
        scooters (
            model,
            brand
        )
    `)
    .eq('id', id)
    .single()

  if (error || !booking) {
    console.error('Error fetching booking for rental start:', error)
    return notFound()
  }

  return (
    <div className="pb-12">
        <RentalWizard 
            bookingId={booking.id} 
            vehicleModel={booking.scooters?.model || 'Scooter'} 
            initialStatus={booking.status}
        />
    </div>
  )
}
