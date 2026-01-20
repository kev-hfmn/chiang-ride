'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Hardcoded for MVP Demo
const DEMO_RENTER_ID = 'demo-renter-123' 

export async function createBookingRequestAction(formData: FormData) {
    const supabase = createAdminClient()
    
    const scooterId = formData.get('scooter_id') as string
    const shopId = formData.get('shop_id') as string
    const startDate = formData.get('start_date') as string
    const endDate = formData.get('end_date') as string
    const totalPrice = parseInt(formData.get('total_price') as string)
    const totalDays = parseInt(formData.get('total_days') as string)
    // const renterName = formData.get('renter_name') as string // Use if we add a form field

    if (!scooterId || !startDate || !endDate) {
        return { error: 'Missing required fields' }
    }

    try {
        const { error } = await supabase
            .from('bookings')
            .insert({
                scooter_id: scooterId,
                shop_id: shopId,
                start_date: startDate,
                end_date: endDate,
                total_price: totalPrice,
                total_days: totalDays,
                status: 'requested',
                customer_name: 'Demo Renter', // Hardcoded for MVP
                renter_id: DEMO_RENTER_ID,    // Hardcoded for MVP
                booking_fee: 0
            })

        if (error) throw error
        
        revalidatePath('/app/bookings')
    } catch (error) {
        console.error('Error creating booking:', error)
        return { error: 'Failed to create booking' }
    }

    redirect('/app/bookings')
}
